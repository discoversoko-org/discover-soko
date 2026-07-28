import "../../styles/auth/loader.css";

export default function Loader({
  fullScreen = true,
}) {
  return (
    <div
      className={
        fullScreen
          ? "auth-loader-overlay"
          : "auth-loader-inline"
      }
    >
      <div className="auth-loader">
        {Array.from({ length: 12 }).map(
          (_, index) => (
            <div key={index} />
          )
        )}
      </div>
    </div>
  );
}