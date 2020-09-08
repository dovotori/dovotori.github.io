import useFetchJs from './useFetchJs';
import useFetchHtml from './useFetchHtml';

const useFetchLabo = (name, hasHtml = false, hasJs = false) => {
  const { pending: pendingHtml, html, error: errorHtml } = useFetchHtml(name, hasHtml);
  const { pending: pendingJs, js, error: errorJs } = useFetchJs(name, hasJs);

  return {
    js,
    html,
    isLoaded: (!hasJs || (hasJs && js)) && (!hasHtml || (hasHtml && html)),
  };
};

export default useFetchLabo;
