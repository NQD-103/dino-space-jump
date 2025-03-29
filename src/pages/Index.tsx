
import Game from '../components/Game';

const Index = () => {
  // Thêm hàm handleKeyDown ở mức trang để đảm bảo sự kiện bàn phím
  // được bắt trước khi trang được tải hoàn toàn
  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log("Phím được nhấn ở trang Index:", e.code);
    if (e.code === 'Space') {
      e.preventDefault();
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <Game />
    </div>
  );
};

export default Index;
