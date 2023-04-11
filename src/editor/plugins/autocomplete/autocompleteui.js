/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
import ReactDOM from 'react-dom';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
import ListSeparatorView from '@ckeditor/ckeditor5-ui/src/list/listseparatorview';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import { keyCodes } from '@ckeditor/ckeditor5-utils/src/keyboard';
import Rect from '@ckeditor/ckeditor5-utils/src/dom/rect';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import TextWatcher from '@ckeditor/ckeditor5-typing/src/textwatcher';
import DomWrapperView from '@ckeditor/ckeditor5-mention/src/ui/domwrapperview';
import AutocompleteView from '@ckeditor/ckeditor5-mention/src/ui/mentionsview';
import { debounce } from '../../utils';
import View from '@ckeditor/ckeditor5-ui/src/view';
import AutoCompleteListItemView from './autocompletelistitemview';
import LabelViewWithIcon from './labelviewwithicon';

import './theme/autocompleteui.scss';

const VERTICAL_SPACING = 3;

export function createRegExp(marker, minimumCharacters) {
  const numberOfCharacters = minimumCharacters === 0 ? '*' : `{${minimumCharacters},}`;
  let autocompleteCharacters = '\u4e00-\u9fa5a-zA-Z0-9a-zA-ZÀ-ž0-9';

  // The pattern consists of 3 groups:
  // - 0 (non-capturing): Opening sequence - start of the line,
  //   not a-zA-Z0-9
  // - 1: The marker character,
  // - 2: Mention input (taking the minimal length into consideration to trigger the UI),
  //
  // The pattern matches up to the caret (end of string switch - $).
  // (0:opening sequence)(1:marker)(2:typed mention)$

  let openingSequence = '';
  if (marker === '@') {
    openingSequence = '(?:^|[^a-zA-Z0-9#])';
  }
  if (marker === '#') {
    autocompleteCharacters = '0-9';
  }

  const pattern = `${openingSequence}([${marker}])([_${autocompleteCharacters}]${numberOfCharacters})$`;

  return new RegExp(pattern, 'u');
}

function createTestCallback(marker, minimumCharacters) {
  const regExp = createRegExp(marker, minimumCharacters);

  return (text) => regExp.test(text);
}

function getFeedText(marker, text) {
  const regExp = createRegExp(marker, 0);

  const match = text.match(regExp);

  return match[2];
}

// The default feed callback.
function createFeedCallback(feedItems) {
  return (feedText) => {
    const filteredItems = feedItems
      // Make the default mention feed case-insensitive.
      .filter((item) => {
        // Item might be defined as object.
        const itemId = typeof item === 'string' ? item : String(item.id);

        // The default feed is case insensitive.
        return itemId.toLowerCase().includes(feedText.toLowerCase());
      })
      // Do not return more than 10 items.
      .slice(0, 10);

    return Promise.resolve(filteredItems);
  };
}

function isHandledKey(keyCode) {
  const handledKeyCodes = [
    keyCodes.arrowup,
    keyCodes.arrowdown,
    keyCodes.enter,
    keyCodes.tab,
    keyCodes.esc,
  ];

  return handledKeyCodes.includes(keyCode);
}

function getBalloonPanelPositions(preferredPosition) {
  const positions = {
    // Positions the panel to the southeast of the caret rectangle.
    caret_se: (targetRect) => ({
      top: targetRect.bottom + VERTICAL_SPACING,
      left: targetRect.right,
      name: 'caret_se',
    }),

    // Positions the panel to the northeast of the caret rectangle.
    caret_ne: (targetRect, balloonRect) => ({
      top: targetRect.top - balloonRect.height - VERTICAL_SPACING,
      left: targetRect.right,
      name: 'caret_ne',
    }),

    // Positions the panel to the southwest of the caret rectangle.
    caret_sw: (targetRect, balloonRect) => ({
      top: targetRect.bottom + VERTICAL_SPACING,
      left: targetRect.right - balloonRect.width,
      name: 'caret_sw',
    }),

    // Positions the panel to the northwest of the caret rect.
    caret_nw: (targetRect, balloonRect) => ({
      top: targetRect.top - balloonRect.height - VERTICAL_SPACING,
      left: targetRect.right - balloonRect.width,
      name: 'caret_nw',
    }),
  };

  // Returns only the last position if it was matched to prevent the panel
  // from jumping after the first match.
  if (Object.prototype.hasOwnProperty.call(positions, preferredPosition)) {
    return [positions[preferredPosition]];
  }

  // By default return all position callbacks.
  return [
    positions.caret_se,
    positions.caret_sw,
    positions.caret_ne,
    positions.caret_nw,
  ];
}

export default class AutocompleteUI extends Plugin {
  static get pluginName() {
    return 'AutocompleteUI';
  }

  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    this.autocompleteView = this.createAutocompleteView();
    this.config = new Map();

    this.balloon = this.editor.plugins.get(ContextualBalloon);

    // Key listener that handles navigation in mention view.
    this.editor.editing.view.document.on(
      'keydown',
      (evt, data) => {
        if (isHandledKey(data.keyCode) && this.isUIVisible) {
          data.preventDefault();
          evt.stop(); // Required for Enter key overriding.

          if (data.keyCode === keyCodes.arrowdown) {
            this.autocompleteView.selectNext();
          }

          if (data.keyCode === keyCodes.arrowup) {
            this.autocompleteView.selectPrevious();
          }

          if (
            data.keyCode === keyCodes.enter
            || data.keyCode === keyCodes.tab
          ) {
            this.autocompleteView.executeSelected();
          }

          if (data.keyCode === keyCodes.esc) {
            this.hideUIAndRemoveMarker();
          }
        }
      },
      { priority: 'highest' },
    ); // Required to override the Enter key.

    // Close the dropdown upon clicking outside of the plugin UI.
    clickOutsideHandler({
      emitter: this.autocompleteView,
      activator: () => this.isUIVisible,
      contextElements: [this.balloon.view.element],
      callback: () => this.hideUIAndRemoveMarker(),
    });
  }

  addConfig({
    feed, marker, sections, minimumCharacters = 0,
    placeholder, loadingText, noResultText, debounceTime,
  }) {
    if (!marker) {
      throw new CKEditorError(
        'mentionconfig-incorrect-marker: The marker must be provided.',
        null,
      );
    }

    const feedCallback = typeof feed === 'function' ? feed : createFeedCallback(feed);

    marker.split('').forEach((char) => {
      const watcher = this.setupTextWatcherForFeed(char, minimumCharacters, sections, debounceTime);

      this.config.set(char, {
        watcher,
        marker: char,
        sections,
        feedCallback,
        placeholder,
        loadingText,
        noResultText,
      });
    });
  }

  destroy() {
    super.destroy();
    // Destroy created UI components as they are not automatically destroyed (see ckeditor5#1341).
    this.autocompleteView.destroy();
  }

  get isUIVisible() {
    return this.balloon.visibleView === this.autocompleteView;
  }

  createAutocompleteView() {
    const { locale } = this.editor;
    const autocompleteView = new AutocompleteView(locale);

    this.items = new Collection();

    autocompleteView.items.bindTo(this.items).using((data) => {
      const { type, loadingText, noResultText } = data;

      const listItemView = new AutoCompleteListItemView(locale);

      if (type === 'loading') {
        const icon = new View();
        icon.element = document.createElement('div');
        icon.element.classList.add('mention_loading');
        const renderLoading = this.editor.config.get('customFunctions').renderLoading;
        renderLoading(icon.element);

        this.renderLabel({
          listItemView,
          text: loadingText,
          isPlaceholder: true,
          icon,
        });
      } else if (type === 'empty') {
        this.renderLabel({
          listItemView,
          text: noResultText,
          isPlaceholder: true,
        });
      } else {
        this.renderListItem({
          ...data, listItemView, autocompleteView,
        });
      }
      return listItemView;
    });

    autocompleteView.on('execute', (_, { item, marker, section }) => {
      const { editor } = this;
      const { model } = editor;
      const { sections } = this.config.get(marker);
      const { command } = sections.get(section);
      const autocompleteMarker = editor.model.markers.get('autocomplete');

      // Create a range on matched text.
      const end = model.createPositionAt(model.document.selection.focus);
      const start = model.createPositionAt(autocompleteMarker.getStart());
      const range = model.createRange(start, end);

      this.hideUIAndRemoveMarker();

      editor.execute(command, {
        item,
        marker,
        range,
      });

      editor.editing.view.focus();
    });

    return autocompleteView;
  }

  renderListItem(
    {
      item, marker, section, isFirstItemOfSection, isLastItemOfSection,
      feedText, listItemView, autocompleteView, isTopItemOfList, hasMore,
    },
  ) {
    const { locale } = this.editor;

    if (isFirstItemOfSection) {
      if (!isTopItemOfList) {
        listItemView.children.add(new ListSeparatorView(locale));
      }
      const isPlaceholder = !feedText;
      const labelText = this.getLabelText(marker, section, isPlaceholder);
      if (labelText) {
        this.renderLabel({
          listItemView,
          text: labelText,
          isPlaceholder,
        });
      }
    }

    const view = this.renderItem(item, marker, section);
    view.delegate('execute').to(listItemView);
    listItemView.children.add(view);

    listItemView.item = item;
    listItemView.marker = marker;

    listItemView.on('execute', () => {
      autocompleteView.fire('execute', {
        item,
        marker,
        section,
      });
    });

    if (hasMore && isLastItemOfSection) {
      const buttonView = new ButtonView(locale);
      buttonView.set({
        label: '点击加载更多',
        withText: true,
        tooltip: false,
        class: ['fetch-more'],
      });

      this.listenTo(buttonView, 'execute', () => {

        this.executeFetchMore({
          feedText,
          marker,
          section,
          ...this.getFetchMore(marker, section),
        });
      });

      listItemView.children.add(buttonView);
    }
  }

  renderLabel({
    listItemView, text, isPlaceholder, icon,
  }) {
    const { locale } = this.editor;
    let label = new LabelView(locale);
    if (icon) {
      label = new LabelViewWithIcon(locale, icon);
    }
    label.text = text;

    if (isPlaceholder) {
      label.extendTemplate({
        attributes: {
          class: 'ck-mention-placeholder',
        },
      });
    }

    listItemView.children.add(label);
  }

  getItemRenderer(marker, section) {
    const { sections } = this.config.get(marker);
    return sections.get(section).renderer;
  }

  getFetchMore(marker, section) {
    const { sections } = this.config.get(marker);
    const data = sections.get(section);
    const offset = this.feeds[section]?.offset;

    return {
      fetchMore: data.fetchMore,
      offset: offset || 0,
    };
  }

  async executeFetchMore({
    fetchMore, marker, feedText, section, offset,
  }) {
    const {
      category, resources, hasMore, offset: nextOffset,
    } = await fetchMore({
      query: feedText,
      category: section,
      offset,
    });

    const { sections } = this.config.get(marker);
    const feed = this.feeds[category];
    this.feeds[category] = {
      ...feed,
      resources: [...feed.resources, ...resources],
      hasMore,
      offset: nextOffset,
    };
    this.renderFeeds({ feedText, marker, sections });
  }

  getLabelText(marker, section, isPlaceholder = false) {
    const { sections, placeholder } = this.config.get(marker);
    return isPlaceholder && placeholder ? placeholder : sections.get(section).label;
  }

  async getFeed(marker, feedText) {
    const { feedCallback } = this.config.get(marker);

    return feedCallback(feedText);
  }

  renderFeeds({ feedText, marker, sections }) {
    this.items.clear();
    let isTopItemOfList = true;

    for (const section of sections.keys()) {
      if (this.feeds[section]) {
        const { resources, hasMore } = this.feeds[section];
        resources.forEach((feedItem, index) => {
          const item = typeof feedItem !== 'object'
            ? { id: feedItem, text: feedItem }
            : feedItem;
          this.items.add({
            item,
            marker,
            section,
            isFirstItemOfSection: index === 0,
            isLastItemOfSection: index === resources.length - 1,
            isTopItemOfList,
            feedText,
            hasMore,
          });
          isTopItemOfList = false;
        });
      }
    }
  }

  setupTextWatcherForFeed(marker, minimumCharacters, sections, debounceTime) {
    const { editor } = this;

    const watcher = new TextWatcher(
      editor.model,
      createTestCallback(marker, minimumCharacters),
    );

    const fetchFeeds = debounce(async (feedText, autocompleteMarker) => {
      this.feeds = await this.getFeed(marker, feedText, sections);

      if (!editor.model.markers.has('autocomplete')) return;
      if (this.feedText !== feedText) return;

      const { noResultText } = this.config.get(marker);
      this.renderFeeds({ feedText, marker, sections });

      if (this.items.length) {
        this.showUI(autocompleteMarker);
      } else if (noResultText) {
        this.items.add({
          type: 'empty',
          noResultText,
        });
      } else {
        this.hideUIAndRemoveMarker();
      }
    }, debounceTime || 0);

    watcher.on('matched', (_, data) => {
      const { selection } = editor.model.document;
      const { focus } = selection;
      const { loadingText } = this.config.get(marker);

      const feedText = getFeedText(marker, data.text);
      this.feedText = feedText;
      const matchedTextLength = marker.length + feedText.length;

      // Create a marker range.
      const start = focus.getShiftedBy(-matchedTextLength);
      const end = focus.getShiftedBy(-feedText.length);

      const markerRange = editor.model.createRange(start, end);

      let autocompleteMarker;
      if (editor.model.markers.has('autocomplete')) {
        autocompleteMarker = editor.model.markers.get('autocomplete');
      } else {
        autocompleteMarker = editor.model.change((writer) => writer.addMarker('autocomplete', {
          range: markerRange,
          usingOperation: false,
          affectsData: false,
        }));
      }

      if (feedText && loadingText) {
        this.items.clear();
        this.items.add({
          type: 'loading',
          loadingText,
        });
        this.showUI(autocompleteMarker);
      }
      fetchFeeds(feedText, autocompleteMarker);
    });

    watcher.on('unmatched', () => {
      this.hideUIAndRemoveMarker();
    });

    return watcher;
  }

  showUI(autocompleteMarker) {
    try {
      if (this.isUIVisible) {
        // Update balloon position as the mention list view may change its size.
        this.balloon.updatePosition(
          this.getBalloonPanelPositionData(
            autocompleteMarker,
            this.autocompleteView.position,
          ),
        );
      } else {
        this.balloon.add({
          view: this.autocompleteView,
          position: this.getBalloonPanelPositionData(
            autocompleteMarker,
            this.autocompleteView.position,
          ),
          withArrow: false,
          singleViewMode: true,
        });
      }
    } catch (e) {
      return;
    }

    this.autocompleteView.position = this.balloon.view.position;

    this.autocompleteView.selectFirst();
  }

  hideUIAndRemoveMarker() {
    // Remove the mention view from balloon before removing marker
    // - it is used by balloon position target().
    if (this.balloon.hasView(this.autocompleteView)) {
      this.balloon.remove(this.autocompleteView);
    }

    if (this.editor.model.markers.has('autocomplete')) {
      this.editor.model.change((writer) => writer.removeMarker('autocomplete'));
    }

    // Make the last matched position on panel view undefined so
    // the #_getBalloonPanelPositionData() method will return all positions
    // on the next call.
    this.autocompleteView.position = undefined;
  }

  renderItem(item, marker, section) {
    const { editor } = this;
    let view;
    let label = item.id;

    const renderer = this.getItemRenderer(marker, section);

    if (renderer) {
      const renderResult = renderer(item);

      if (typeof renderResult !== 'string') {
        view = new DomWrapperView(editor.locale, renderResult);
      } else {
        label = renderResult;
      }
    }

    if (!view) {
      const buttonView = new ButtonView(editor.locale);

      buttonView.label = label;
      buttonView.withText = true;

      view = buttonView;
    }

    return view;
  }

  getBalloonPanelPositionData(autocompleteMarker, preferredPosition) {
    const { editor } = this;
    const { editing } = this.editor;
    const { domConverter } = editing.view;
    const { mapper } = editing;

    return {
      target: () => {
        let modelRange = autocompleteMarker.getRange();

        // Target the UI to the model selection range
        // - the marker has been removed so probably the UI will not be shown anyway.
        // The logic is used by ContextualBalloon to display another panel in the same place.
        if (modelRange.start.root.rootName === '$graveyard') {
          modelRange = editor.model.document.selection.getFirstRange();
        }

        try {
          const viewRange = mapper.toViewRange(modelRange);
          const rangeRects = Rect.getDomRangeRects(
            domConverter.viewRangeToDom(viewRange),
          );

          return rangeRects.pop();
        } catch (e) {
          return null;
        }
      },
      limiter: () => {
        const { view } = this.editor.editing;
        const viewDocument = view.document;
        const { editableElement } = viewDocument.selection;

        if (editableElement) {
          return view.domConverter.mapViewToDom(editableElement.root);
        }

        return null;
      },
      positions: getBalloonPanelPositions(preferredPosition),
    };
  }
}
