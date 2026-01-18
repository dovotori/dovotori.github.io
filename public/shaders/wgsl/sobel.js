// uniform sampler2D	texture;
// uniform float 		width;
// uniform float 		height;

// void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
// {
// 	float w = 1.0 / width;
// 	float h = 1.0 / height;

// 	n[0] = texture2D(tex, coord + vec2( -w, -h));
// 	n[1] = texture2D(tex, coord + vec2(0.0, -h));
// 	n[2] = texture2D(tex, coord + vec2(  w, -h));
// 	n[3] = texture2D(tex, coord + vec2( -w, 0.0));
// 	n[4] = texture2D(tex, coord);
// 	n[5] = texture2D(tex, coord + vec2(  w, 0.0));
// 	n[6] = texture2D(tex, coord + vec2( -w, h));
// 	n[7] = texture2D(tex, coord + vec2(0.0, h));
// 	n[8] = texture2D(tex, coord + vec2(  w, h));
// }

// void main(void)
// {
// 	vec4 n[9];
// 	make_kernel( n, texture, gl_TexCoord[0].st );

// 	vec4 sobel_edge_h = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
//   	vec4 sobel_edge_v = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
// 	vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));

// 	gl_FragColor = vec4( 1.0 - sobel.rgb, 1.0 );
// }

export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var depthMap: texture_2d<f32>;
@group(0) @binding(2) var<uniform> texelSize: vec2<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  let pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  3.0),
    vec2<f32>( 3.0, -1.0),
  );

  let uv = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, -1.0),
    vec2<f32>(2.0, 1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  output.uv = uv[vertexIndex];
  return output;
}

fn make_kernel(tex: texture_2d<f32>, samp: sampler, coord: vec2<f32>) -> array<vec4<f32>, 9>
{
	var w = texelSize.x;
	var h = texelSize.y;

  var n: array<vec4<f32>, 9>;

  n[0] = textureSample(tex, samp, coord + vec2<f32>(-w, -h));
  n[1] = textureSample(tex, samp, coord + vec2<f32>(0.0, -h));
  n[2] = textureSample(tex, samp, coord + vec2<f32>(w, -h));
  n[3] = textureSample(tex, samp, coord + vec2<f32>(-w, 0.0));
  n[4] = textureSample(tex, samp, coord);
  n[5] = textureSample(tex, samp, coord + vec2<f32>(w, 0.0));
  n[6] = textureSample(tex, samp, coord + vec2<f32>(-w, h));
  n[7] = textureSample(tex, samp, coord + vec2<f32>(0.0, h));
  n[8] = textureSample(tex, samp, coord + vec2<f32>(w, h));

  return n;
}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  var n: array<vec4<f32>, 9> = make_kernel(depthMap, mySampler, uv);

	var sobel_edge_h = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
  var sobel_edge_v = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
	var sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));

  var outCol = 1.0 - sobel.rgb;
  return vec4<f32>(outCol, 1.0);


  // var rgb = textureSample(depthMap, mySampler, uv).rgb;
  // return vec4<f32>(rgb, 1.0);
}
`;
