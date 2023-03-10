import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    wrapper: {
      display: 'flex',
    },
    avatar: {
      width: '20px!important',
      height: '20px!important',
      lineHeight: '20px!important',
      borderRadius: '100%',
      flexShrink: 0,
    },
    name: {
      marginLeft: '8px!important',
      lineHeight: '20px!important',
      verticalAlign: 'baseline!important',
    },
  }),
  { name: 'MentionMemberItem' },
);

const MemberItem = ({
  name, avatar,
}) => {
  const classes = useStyles();

  return <div className={classes.wrapper}>
    <img className={classes.avatar} src={avatar} />
    <span className={classes.name}>{name}</span>
  </div>;
};

export default MemberItem;
