export default `@fragment 
fn f_main(@location(0) color: vec4f) -> @location(0) vec4f {
    return vec4f(color.rgb * color.a, color.a);
} 
`;
