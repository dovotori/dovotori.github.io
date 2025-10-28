import Mat4 from '../utils/maths/Mat4';
import Transform from '../utils/maths/Transform';

export class BufferSkin {
  constructor() {
    this.buffer = null;
    this.joints = null;
  }

  // setup(device, accessor) {
  //   this.buffer = device.createBuffer({
  //     label: 'skin joint matrices buffer',
  //     size: 16 * 6 * Float32Array.BYTES_PER_ELEMENT, // 6 (MAX_JOINT_MAT from shader) matrices 4x4
  //     mappedAtCreation: true,
  //     usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
  //   });
  //   const mappedBufferArray3 = new Float32Array(this.buffer.getMappedRange()); // color float
  //   mappedBufferArray3.set(accessor.buffer);
  //   this.buffer.unmap();
  // }

  setup(device, joints) {
    this.joints = joints;
    this.buffer = device.createBuffer({
      label: 'skin joint matrices buffer',
      size: 16 * 6 * Float32Array.BYTES_PER_ELEMENT, // 6 (MAX_JOINT_MAT from shader) matrices 4x4
      // mappedAtCreation: true,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });

    this.uniformValues = new Float32Array(16 * 6);

    // const mappedBufferArray = new Float32Array(this.buffer.getMappedRange()); // color float
    // mappedBufferArray.set(data);
    // this.buffer.unmap();
  }

  computeJointMatrix(joints, parentMatrix, animations) {
    const matrices = [];
    for (const joint of joints) {
      const hasAnim = animations?.hasAnim(joint.id) ?? false;
      const localMatrix = hasAnim
        ? animations?.handleLocalTransform(joint.id)
        : Transform.handleLocalTransform(joint);

      localMatrix.multiply(parentMatrix);

      const jointInverse = new Mat4();
      jointInverse.setFromArray(joint.invMatrix);

      const finalMatrix = new Mat4();
      finalMatrix.identity();
      finalMatrix.multiply(jointInverse);
      finalMatrix.multiply(localMatrix);

      matrices.push(finalMatrix.get());

      if (joint.children) {
        const childrenMatrices = this.computeJointMatrix(joint.children, localMatrix, animations);
        matrices.push(...childrenMatrices);
      }
    }
    return matrices;
  }

  update(device, animations) {
    const jointMatrix = new Mat4();
    jointMatrix.identity();
    const matrices = this.computeJointMatrix(this.joints, jointMatrix, animations);
    const flat = matrices.flat();
    this.uniformValues.fill(0); // clear then set (prevent leftover data)
    this.uniformValues.set(flat.slice(0, this.uniformValues.length)); // copy only up to buffer length (avoid overflow if compute returned more)

    device.queue.writeBuffer(
      this.buffer,
      0,
      this.uniformValues.buffer,
      this.uniformValues.byteOffset,
      this.uniformValues.byteLength,
    );
  }

  get() {
    return this.buffer;
  }
}
