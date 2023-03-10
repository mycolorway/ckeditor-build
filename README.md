# Ckeditor-build
ckeditor 编辑器 - 自定义构建

# Install
`pnpm add ckeditor5-build-task`

# Hot to use
```javascript
import CKEditor from 'ckeditor-build-task';

function Editor(props) {
  return (
    <CKEditor
      {...props}
    />
  )
}
```

# Attributes
| props | description | types | required |
| ----- | ----------- | ----- | -------- |
| type | classic, inline, balloon | string |    |
| data | the editor content | string |   |
| disabled | disabled | boolean |     |
| openTask | Click the task name to open the task detail page | function | * |
| apolloClient | the apollo client for mention and image upload plugins | object | * |
| imageStorageUrl | the image prefix url | string | * |
| renderReactComponents | render the task, member, loading react component | object | * |
| handleAfterCommandExec | Callback events for the editor functionality | function |   |
| openImageViewer | Click on the image for a larger view | function | * |
| onSyncTaskChange | used in task detail page to control the task description submit | function | * |
| language | language | string |   |

# renderReactComponents example
```
const renderReactComponents = useMemo(() => {
  renderTaskItem: (item, domElement) => {
      ReactDOM.render(
        <TaskItem
          title={item.title}
          completeStatus={item.completeStatus}
          uniqueSearchId={item.uniqueSearchId}
          assignee={item.assignee}
          category={item.category}
          dueDate={item.dueDate}
        />,
        domElement,
      );
    },
    renderMemberItem: (item, domElement) => {
      ReactDOM.render(
        <MemberItem
          avatar={processAvatarUrl(item.avatar)}
          name={item.name}
        />,
        domElement,
      );
    },
    renderLoading: (domElement) => {
      ReactDOM.render(
        <div>Loading</div>,
        domElement,
      );
    },
})
```




