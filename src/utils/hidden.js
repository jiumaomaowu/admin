
class Hidden{
  constructor(menucom,menuarray, data){

      this.menucom = menucom;
      this.menuarray = menuarray;
      this.data = data;
  }
  toArray(){
      // console.log(2)
      this.data.forEach(item => {
          if (item.top_menu == "顶级菜单") {
              this.menuarray.push(item)
          } else {
              this.menucom.push(item)
          }
      })
      // console.log(this.menuarray)

      return this.toMenu(this.menuarray,this.menucom)
  }
  toMenu(menuarray,menucom){
      // console.log(3)
      let _that = this
      menuarray.forEach(element => {
          menucom.forEach(v => {
              if (element.name == v.top_menu) {
                  element.children.push(v)
                  element.children = Array.from(new Set(element.children))
              }
              if (element.children) {
                  _that.toMenu(element.children, menucom)
              }
          });
      })
      // console.log(menuarray)
      return menuarray;
      // return this.data
  }
}




export { Hidden }
