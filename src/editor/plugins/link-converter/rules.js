import { gql } from '@apollo/client';

export const TASK_URL_REG = /[?&]task=(.{24})|tasks\/(.{24})|tasks%2F(.{24})/;

export function randomHex(length = 12) {
  const maxLength = 8;
  const min = 16 ** (Math.min(length, maxLength) - 1);
  const max = 16 ** Math.min(length, maxLength) - 1;
  const randomHexNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  let randomStr = randomHexNumber.toString(16);
  while (randomStr.length < length) {
    randomStr += randomHex(length - maxLength);
  }

  return randomStr;
}

const GET_TASK = gql`
  query GetTask($uuid: String!) {
    task(uuid: $uuid) {
      uuid
      uniqueId
      uniqueSearchId
      title
    }
  }
`;

export default [
  {
    regex: TASK_URL_REG,
    convertLink: async ({ matches, t, apolloClient }) => {
      let result;
      try {
        result = await apolloClient.query({
          query: GET_TASK,
          variables: { uuid: matches[1] || matches[2] || matches[3] || matches[4] },
          fetchPolicy: 'network-only',
        });
      } catch (error) {
        if (error) return '';
      }
      return result.data
        ? `${t('[Task]')} ${result.data.task.uniqueSearchId} ${result.data.task.title}`
        : '';
    },
  },
  {
    regex: /https:\/\/github.com\/(.+)\/(.+)\/(pull|issues)\/(\d+)/,
    convertLink: ({ matches }) => {
      if (matches.length !== 5) return '';
      return `[Github] ${matches[1]}/${matches[2]}#${matches[4]}`;
    },
  },
  {
    regex: /https:\/\/github.com\/(.+)\/(.+)\/commit\/(.+)/,
    convertLink: ({ matches }) => {
      if (matches.length !== 4) return '';
      return `[Github] ${matches[1]}/${matches[2]}@${matches[3].slice(0, 7)}`;
    },
  },
  {
    regex: /figma\.com\/(file|proto)\/.+\/([^?/]+)/,
    convertLink: ({ matches }) => {
      if (matches.length !== 3) return '';
      return `[Figma] ${decodeURIComponent(matches[2])}`;
    },
  },
];
