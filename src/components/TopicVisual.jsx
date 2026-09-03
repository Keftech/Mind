import "./TopicVisual.css";

export default function TopicVisual({ visual }) {
  if (!visual) return null;

  return (
    <figure className="topic-visual">
      <img
        src={visual.src}
        alt={visual.alt || ""}
        loading="lazy"
      />

      {visual.caption && (
        <figcaption>{visual.caption}</figcaption>
      )}
    </figure>
  );
}