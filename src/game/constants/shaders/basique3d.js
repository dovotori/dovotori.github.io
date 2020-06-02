import vertex from './basicVertex';
import fragment from './basicFrag';

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view'],
};
