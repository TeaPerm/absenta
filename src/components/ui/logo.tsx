import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="text-2xl font-bold text-theme cursor-pointer"
      onClick={() => {
        navigate("/");
        window.scrollTo(0, 0);
      }}
    >
      Absent
      <span className="text-theme/30">a</span>
    </div>
  );
};

export default Logo;
