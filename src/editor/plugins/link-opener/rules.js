import { TASK_URL_REG } from '../link-converter/rules';

export default [
  {
    regex: TASK_URL_REG,
    openLink({ matches }, openTask) {
      openTask(matches[1] || matches[2] || matches[3] || matches[4],
        { replace: false, routerBack: true });
    },
  },
];
