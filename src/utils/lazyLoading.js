// export default (name) => () => import(`@/components/${name}/${name}.vue`)



function lazy(name) {

  let file = name

  if (name !== 'dashboard') {
    return () => import(`@/views/${file}/${name}.vue`)
  } else {
    
    return () => import(`@/views/${name}.vue`)
  }
}
export {lazy}
