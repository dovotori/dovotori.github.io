import Objet from '../gltf/ObjetGltf'
import ObjetAnim from '../gltf/ObjetGltfAnim'
import ObjetSkin from '../gltf/ObjetGltfSkin'

class ManagerGltfs {
  constructor(gl, gltfs) {
    this.gltfs = {}
    Object.keys(gltfs).forEach((name) => {
      if (gltfs[name].skins) {
        this.gltfs[name] = new ObjetSkin(gl, gltfs[name])
      } else if (ManagerGltfs.hasAnimation(gltfs[name].nodes)) {
        this.gltfs[name] = new ObjetAnim(gl, gltfs[name])
      } else {
        this.gltfs[name] = new Objet(gl, gltfs[name])
      }
    })
  }

  static hasAnimation = (nodes) => {
    let hasAnim = false
    Object.keys(nodes).forEach((key) => {
      const node = nodes[key]
      if (!hasAnim && node.animations) {
        hasAnim = true
      }
    })
    return hasAnim
  }

  get(id) {
    return this.gltfs[id]
  }
}

export default ManagerGltfs
