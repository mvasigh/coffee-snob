import './BusinessCard.css';

export default function BusinessCard({ name, rating, reviewCount }) {
  return (
    <div className="BusinessCard">
      <p className="Title">{name}</p>
      <p>
        Rating: {rating}/5 ({reviewCount} reviews)
      </p>
    </div>
  );
}
