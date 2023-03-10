import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { randomHex } from './rules';
import CONVERT_LINK_RULES from './rules';

export default class LinkConverter extends Plugin {
  static get pluginName() {
    return 'LinkConverter';
  }

  init() {
    this.apolloClient = this.editor.config.get('apolloClient');
    this.editor.model.schema.extend('$text', {
      allowAttributes: 'linkConverted',
    });
    this.definePostFixer();
  }

  definePostFixer() {
    const { editor } = this;
    const { document } = editor.model;

    document.registerPostFixer((writer) => {
      if (editor.state !== 'ready') return false;
      const changes = document.differ.getChanges();

      return changes.some((entry) => {
        if (entry.type === 'insert' && entry.name === '$text') {
          const node = entry.position.nodeAfter;
          const { textNode } = entry.position;
          const linkHref = node ? node.getAttribute('linkHref') : '';

          if (linkHref && linkHref === node.data) {
            if (node.getAttribute('linkConverted')) return false;
            writer.setAttributes({ linkHref, linkConverted: true }, node);

            let data;
            CONVERT_LINK_RULES.some((rule) => {
              const matches = linkHref.match(rule.regex);
              if (!matches) return false;
              data = { linkHref, matches, ...rule };
              return true;
            });

            if (!data) return false;

            const marker = writer.addMarker(`linkMarker:${randomHex(6)}`, {
              range: writer.createRange(
                entry.position,
                entry.position.getShiftedBy(linkHref.length),
              ),
              usingOperation: false,
              affectsData: true,
            });
            this.convertLink(marker, data);
          }
          let taskInfo = node?.data || textNode?.data.slice(entry?.position?.offset);
          let taskInfoLink = node?.nextSibling?.data || textNode?.nextSibling?.data;
          if (taskInfo && !taskInfoLink) {
            taskInfoLink = taskInfo.split(' ').pop();
            taskInfo = taskInfo.replace(taskInfoLink, '');
          }
          if (taskInfoLink && taskInfo && taskInfo[0] === '#') {
            const marker = writer.addMarker(`linkMarker:${randomHex(6)}`, {
              range: writer.createRange(
                entry.position,
                entry.position.getShiftedBy(taskInfo.length + taskInfoLink.length),
              ),
              usingOperation: false,
              affectsData: true,
            });

            const data = {
              linkHref: taskInfoLink,
              convertLink: ({ t }) => `${t('[Task]')} ${taskInfo}`,
            };
            this.convertLink(marker, data);
          }
        }
        return false;
      });
    });
  }

  async convertLink(marker, data) {
    const { editor, apolloClient } = this;
    const title = await data.convertLink({
      matches: data.matches,
      t: editor.t,
      apolloClient,
    });
    const range = marker.getRange();

    editor.model.change((writer) => {
      writer.removeMarker(marker);
      if (title) {
        const link = writer.createText(title);
        writer.setAttributes(
          {
            linkHref: data.linkHref,
            linkConverted: true,
          },
          link,
        );
        writer.remove(range);
        writer.insert(link, range.start);
      }
    });
  }
}
