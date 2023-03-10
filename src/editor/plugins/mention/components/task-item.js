import { useReadableDate } from '@/modules/readable-date';
import TaskStatusIcon from '@/components/task-complete-status/icon';
import classes from './style/task-item.module.scss';
import clsx from 'clsx';

const TaskItem = ({
  title, uniqueSearchId, assignee, dueDate, completeStatus, category,
}) => {
  const readableDate = useReadableDate();

  return <div className={classes.wrapper}>
    <div className={classes.left}>
      <TaskStatusIcon
        className={classes.iconWrap}
        sizeClassName={clsx(
          classes.statusIcon,
          category === 'milestone' && classes.milestoneIcon
        )}
        category={category}
        status={completeStatus}
      />
    </div>
    <div className={classes.right}>
      <div className={classes.title}>{title}</div>
      <div className={classes.info}>
        <span className={classes.optionCaption}>{uniqueSearchId}</span>
        {assignee && <>
          <span className={classes.line} />
          <span className={classes.span} >{assignee.name}</span>
        </>}
        {dueDate && <>
          <span className={classes.line} />
          <span className={classes.span} >{readableDate(new Date(dueDate))}</span>
        </>}
      </div>
    </div>
  </div>;
};

export default TaskItem;
