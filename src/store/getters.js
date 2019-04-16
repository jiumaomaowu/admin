const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission: state => state.user.addPermission,
  // addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  menuitems : state => state.user.items,
  isLoadRoutes : state => state.user.isLoadRoutes,
  count: state => state.user.count,
  userForm:state => state.user.userF,
  userInfo:state => state.user.addUserinfo,
  allSelection:state => state.user.addSelection,
  row:state => state.user.row
}
export default getters
