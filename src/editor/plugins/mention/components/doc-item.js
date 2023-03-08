import { makeStyles } from '@material-ui/core/styles';
import FileIcon from '@/components/file-icon';
import { ICONS_MAPPING } from '../../../../public/contants';

const useStyles = makeStyles(
  () => ({
    wrapper: {
      display: 'flex',
    },
    left: {
      width: '20px!important',
      lineHeight: '20px!important',
      marginRight: '10px!important',
      flexShrink: 0,
      '& svg': {
        verticalAlign: 'top!important',
        width: '20px!important',
        height: '20px!important',
      },
    },
    right: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '14px!important',
      lineHeight: '20px!important',
      color: '#222!important',
    },
  }),
  { name: 'MentionDocItem' },
);

const DocItem = ({
  name, category,
}) => {
  const classes = useStyles();

  return <div className={classes.wrapper}>
    <div className={classes.left}>
      <FileIcon
        fileName={name}
        icon={ICONS_MAPPING[category]}
        fontSize="small"
      />
    </div>
    <div className={classes.right}>{name}</div>
  </div>;
};

export default DocItem;
