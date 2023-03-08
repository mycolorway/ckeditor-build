import ReactDOM from 'react-dom';
import { gql } from '@apollo/client';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AutocompleteUI from '../autocomplete/autocompleteui';
import TaskItem from './components/task-item';
import DocItem from './components/doc-item';
import MemberItem from './components/member-item';

const GET_MEMBERS = gql`
  query GetMembers {
    resourceSelectIdentities(
      excludeDepartment: true
      first: 999
    ) {
      nodes {
        id
        uuid
        name
        pinyin
        pinyinAbbr
        ... on MemberSelectOption {
          avatar
        }
      }
    }
  }
`;

const SEARCH_CATEGORIES = gql`
query SearchCategories (
  $keyword: String!
  $categories: [String!]
  $limit: Int
) {
  searchCategories(
    keyword: $keyword
    categories: $categories
    limit: $limit
  ) {
    category
    resources {
      ... on Member {
        id
        uuid
        name
        pinyin
        pinyinAbbr
        avatar
      }
      ... on Task {
        uuid
        uniqueId
        uniqueSearchId
        title
        assignee {
          uuid
          name
          avatar
        }
        completeStatus
        dueDate
        category
      }
    }
    totalCount
    hasMore
    offset
  }
}
`;

const SEARCH_CATEGORY = gql`
query SearchCategory($keyword: String!, $category: String!, $offset: Int, $limit: Int) {
  searchCategory(keyword: $keyword, category: $category, offset: $offset, limit: $limit) {
    category
    resources {
      ... on Member {
        id
        uuid
        name
        pinyin
        pinyinAbbr
        avatar
      }
      ... on Task {
        uuid
        uniqueId
        uniqueSearchId
        title
        assignee {
          uuid
          name
          avatar
        }
        completeStatus
        dueDate
        category
      }
    }
    totalCount
    hasMore
    offset
  }
}
`;

function itemRenderer(item, processAvatarUrl) {
  const itemElement = document.createElement('span');
  itemElement.classList.add('mention__item');

  ReactDOM.render(<MemberItem
    avatar={processAvatarUrl(item.avatar)}
    name={item.name}
  ></MemberItem>, itemElement);

  return itemElement;
}

function taskRenderer(item) {
  const itemElement = document.createElement('span');
  itemElement.classList.add('mention__item');

  ReactDOM.render(<TaskItem
    title={item.title}
    completeStatus={item.completeStatus}
    uniqueSearchId={item.uniqueSearchId}
    assignee={item.assignee}
    category={item.category}
    dueDate={item.dueDate}
  ></TaskItem>, itemElement);

  return itemElement;
}

function docRenderer(item) {
  const itemElement = document.createElement('span');
  itemElement.classList.add('mention__item');

  ReactDOM.render(<DocItem
    name={item.name}
    category={item.category}
  />, itemElement);

  return itemElement;
}

export default class MentionUI extends Plugin {
  static get pluginName() {
    return 'MentionUI';
  }

  static get requires() {
    return [AutocompleteUI];
  }

  init() {
    this.apolloClient = this.editor.config.get('apolloClient');
    const { t } = this.editor.locale;

    const autocompleteUI = this.editor.plugins.get(AutocompleteUI);
    autocompleteUI.addConfig({
      marker: '@',
      placeholder: t('Mention resources'),
      loadingText: t('Loading'),
      noResultText: t('Resource Not Found'),
      debounceTime: 300,
      sections: new Map([
        [
          'member',
          {
            label: t('Members'),
            renderer: itemRenderer,
            command: 'membersMention',
            fetchMore: this.getMoreFeedFetcher(),
          },
        ],
        [
          'task',
          {
            label: t('Tasks'),
            renderer: taskRenderer,
            command: 'tasksMention',
            fetchMore: this.getMoreFeedFetcher(),
          },
        ],
      ]),
      feed: async (query) => this.filterFeed(query),
    });

    autocompleteUI.addConfig({
      marker: '#',
      placeholder: t('Mention resources task'),
      loadingText: t('Loading'),
      noResultText: t('Resource Not Found Task'),
      debounceTime: 300,
      sections: new Map([
        [
          'task',
          {
            label: t('Tasks'),
            renderer: taskRenderer,
            command: 'tasksMention',
            fetchMore: this.getMoreFeedFetcher(),
          },
        ],
      ]),
      feed: async (query) => this.filterTaskFeed(query),
    });
  }

  async fetchMembers() {
    const {
      data: { resourceSelectIdentities },
    } = await this.apolloClient.query({
      query: GET_MEMBERS,
      fetchPolicy: 'network-only',
    });

    return resourceSelectIdentities.nodes;
  }

  async filterRemoteFeed(query) {
    const categories = ['member', 'task', 'lark_file'];
    const {
      data: { searchCategories },
    } = await this.apolloClient.query({
      query: SEARCH_CATEGORIES,
      fetchPolicy: 'network-only',
      variables: {
        keyword: query,
        categories,
      },
    });

    const feeds = {};
    categories.forEach((category, index) => {
      const feed = searchCategories[index];
      if (feed && feed.resources.length) {
        feeds[category] = feed;
      }
    });

    return feeds;
  }

  async filterFeed(query) {
    if (!query) {
      return {
        member: {
          resources: await this.fetchMembers(),
        },
      };
    }

    return this.filterRemoteFeed(query);
  }

  async filterTaskFeed(query) {
    return this.filterRemoteFeed(`#${query}`);
  }

  getMoreFeedFetcher() {
    let offset = 0;
    let loading = false;

    return async ({ query, category }) => {
      if (loading) { return false; }
      loading = true;
      offset += 5;
      const {
        data: { searchCategory },
      } = await this.apolloClient.query({
        query: SEARCH_CATEGORY,
        fetchPolicy: 'network-only',
        variables: {
          keyword: query,
          category,
          offset,
          limit: 5,
        },
      });
      loading = false;
      return searchCategory;
    };
  }
}
