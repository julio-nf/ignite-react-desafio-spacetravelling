export function Comments(): JSX.Element {
  return (
    <section
      ref={elem => {
        if (!elem || elem.childNodes.length) {
          return;
        }
        const scriptElem = document.createElement('script');
        scriptElem.src = 'https://utteranc.es/client.js';
        scriptElem.async = true;
        scriptElem.crossOrigin = 'anonymous';
        scriptElem.setAttribute(
          'repo',
          'julio-nf/ignite-react-desafio-spacetravelling'
        );
        scriptElem.setAttribute('issue-term', 'pathname');
        scriptElem.setAttribute('label', '[Blog comment]');
        scriptElem.setAttribute('theme', 'github-dark');
        elem.appendChild(scriptElem);
      }}
    />
  );
}
