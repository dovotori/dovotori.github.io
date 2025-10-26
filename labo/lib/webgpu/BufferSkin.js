import Mat4 from '../utils/maths/Mat4';
import Transform from '../utils/maths/Transform';

export class BufferSkin {
  constructor() {
    this.buffer = null;
  }

  setup(device, accessor) {
    this.buffer = device.createBuffer({
      label: 'skin joint matrices buffer',
      size: 16 * 6 * Float32Array.BYTES_PER_ELEMENT, // 6 (MAX_JOINT_MAT from shader) matrices 4x4
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });
    const mappedBufferArray3 = new Float32Array(this.buffer.getMappedRange()); // color float
    mappedBufferArray3.set(accessor.buffer);
    this.buffer.unmap();
  }

  setupJointsMatrices(device, joints) {
    const jointMatrix = new Mat4();
    jointMatrix.identity();
    const matrices = this.setupJointMatrix(joints, jointMatrix);
    const data = new Float32Array(matrices.flat());
    console.log({ joints, matrices, data });

    this.buffer = device.createBuffer({
      label: 'skin joint matrices buffer',
      size: 16 * 6 * Float32Array.BYTES_PER_ELEMENT, // 6 (MAX_JOINT_MAT from shader) matrices 4x4
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });
    const mappedBufferArray = new Float32Array(this.buffer.getMappedRange()); // color float
    mappedBufferArray.set(data);
    this.buffer.unmap();
  }

  setupJointMatrix(joints, parentMatrix) {
    const matrices = [];
    for (const joint of joints) {
      const localMatrix = Transform.handleLocalTransform(joint);
      localMatrix.multiply(parentMatrix);

      const jointInverse = new Mat4();
      jointInverse.setFromArray(joint.invMatrix);

      const finalMatrix = new Mat4();
      finalMatrix.identity();
      finalMatrix.multiply(jointInverse);
      finalMatrix.multiply(localMatrix);

      matrices.push(finalMatrix.get());

      if (joint.children) {
        const childrenMatrices = this.setupJointMatrix(joint.children, localMatrix);
        matrices.push(...childrenMatrices);
      }
    }
    return matrices;
  }

  update() {}

  get() {
    return this.buffer;
  }
}
