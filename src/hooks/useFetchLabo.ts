import useFetchHtml from "./useFetchHtml";
import useFetchJs from "./useFetchJs";

const useFetchLabo = (name: string, hasHtml = false, hasJs = false) => {
  const { html /* pending: pendingHtml,  error: errorHtml */ } = useFetchHtml(name, hasHtml);
  const { js /* pending: pendingJs,  error: errorJs */ } = useFetchJs(name, hasJs);

  return {
    js,
    html,
    isLoaded: (!hasJs || (hasJs && js)) && (!hasHtml || (hasHtml && html)),
  };
};

export default useFetchLabo;
