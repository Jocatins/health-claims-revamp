import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ActionMenuProps {
  onEdit: () => void;
  onView: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onView }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-center" ref={menuRef}>
      {/* Icon button */}
      <div
        className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <BsThreeDotsVertical className="text-gray-600" />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
          <button
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => {
              onView();
              setOpen(false);
            }}
          >
         View
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
