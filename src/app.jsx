import React from 'react';
import { render } from 'react-dom';

import Editor from './editor/editor';

export default function App() {

  const customFunctions = {
    renderTaskItem: (item, domElement) => {
      render(<div> task </div>, domElement)
    },
    renderMemberItem: (item, domElement) => {
      render(<div> member </div>, domElement)
    }
  }

  const apolloClient = {
    query: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              resourceSelectIdentities: {
                nodes: [
                  {
                    id: 1,
                    title: 'task1',
                  },
                  {
                    id: 2,
                    title: 'task2',
                  },
                ]
              },
              searchCategories: {
                member: [
                  {
                    id: 1,
                    title: 'task1',
                  },
                  {
                    id: 2,
                    title: 'task2',
                  },
                ]
              }
            },
          });
        }, 1000);
      }
      );
    }
  }
  return (
    <>
      <Editor
        apolloClient={apolloClient}
        customFunctions={customFunctions}
        language="en-US"
      />
    </>
  );
}