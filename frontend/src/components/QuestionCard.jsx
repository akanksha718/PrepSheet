import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/Theme";
import useSheetStore from "../store/sheetStore";
import { Trash2, Edit3, GripVertical } from "lucide-react";
import { ChevronRight } from "lucide-react";
import SubTopics from "./SubTopics";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function QuestionCard({ topic }) {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const deleteTopic = useSheetStore((state) => state.deleteTopic);
    const editTopic = useSheetStore((state) => state.editTopic);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(topic.title);
    const inputRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: topic.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(editTitle.length, editTitle.length);
        }
    }, [isEditing, editTitle.length]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (editTitle.trim()) {
            editTopic(topic.id, editTitle.trim());
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSaveEdit();
        } else if (e.key === "Escape") {
            setEditTitle(topic.title);
            setIsEditing(false);
        }
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
          transition
      `}

        >

            {/* Header */}
            <div className="flex  p-2 items-center hover:bg-[#303232] rounded-xl justify-between">
                <div className="flex items-center gap-2 flex-1">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300"
                        title="Drag to reorder"
                    >
                        <GripVertical size={18} />
                    </button>
                    <h2 onClick={() => setIsOpen(!isOpen)} className="group flex items-center gap-3 text-lg sm:text-xl font-semibold cursor-pointer flex-1">
                    <span className="text-orange-500 transition-transform duration-200 group-hover:translate-x-1">
                        <ChevronRight
                            className={`transition-transform ${isOpen ? "rotate-90" : ""
                                }`}
                            size={20}
                        />
                    </span>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={handleKeyDown}
                            className="bg-gray-700 text-white px-2 py-1 rounded outline-none flex-1"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span>{topic.title}</span>
                    )}
                </h2>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick();
                        }}
                        className="text-sm opacity-70 hover:opacity-100"
                        title="Edit topic"
                    >
                        <Edit3 size={18} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTopic(topic.id);
                        }}
                        className="text-red-500 hover:text-red-600"
                        title="Delete topic"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* SubTopics Section (when expanded) */}
            {isOpen && topic.subTopics && (
                <SubTopics topicId={topic.id} subTopics={topic.subTopics} />
            )}

        </div>
    );
}

