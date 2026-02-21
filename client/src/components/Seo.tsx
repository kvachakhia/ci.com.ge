import { useEffect } from "react";

export default function Seo(props: { title: string; description: string }) {
  useEffect(() => {
    document.title = props.title;

    const existing =
      (document.querySelector('meta[name="description"]') as HTMLMetaElement | null) ??
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m as HTMLMetaElement;
      })();

    existing.setAttribute("content", props.description);
  }, [props.title, props.description]);

  return null;
}
