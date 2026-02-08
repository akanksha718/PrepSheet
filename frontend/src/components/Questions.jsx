import { useTheme } from "../context/Theme";
import useSheetStore from "../store/sheetStore";
import QuestionCard from "./QuestionCard";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function QuestionList() {
    const { theme } = useTheme();

    const isLight = theme === "light";

    const topics = useSheetStore((state) => state.topics);
    const addTopic = useSheetStore((state) => state.addTopic);
    const reorderTopics = useSheetStore((state) => state.reorderTopics);

    const [topicTitle, setTopicTitle] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddTopic = () => {
        if (!topicTitle.trim()) return;
        addTopic(topicTitle);
        setTopicTitle("");
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = topics.findIndex((t) => t.id === active.id);
            const newIndex = topics.findIndex((t) => t.id === over.id);
            reorderTopics(oldIndex, newIndex);
        }
    };


    return (
        <div
            className={`
        ${isLight ? "bg-white text-black" : "bg-[#292a2a] text-white"}
        rounded-xl shadow-md p-3 sm:p-4 space-y-2
      `}
        >
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-semibold">
                PrepSheet – Interactive Question Management Sheet
            </h1>

            {/* Description */}
            <p className={`${isLight ? "text-gray-600" : "text-gray-300"} text-sm sm:text-base max-w-3xl`}>
                Increase your productivity by adding questions and topics to your sheet.
                Track your progress and stay organized with ease.
            </p>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                    type="text"
                    placeholder="Enter topic name"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    className={`
      flex-1 px-4 py-2 rounded-md text-sm outline-none
      ${isLight
                            ? "border border-gray-300 bg-white text-black"
                            : "border border-gray-600 bg-[#2f3131] text-white"}
    `}
                />

                <button
                    onClick={handleAddTopic}
                    className={`
      rounded-md px-5 py-2 text-sm font-medium transition
      ${isLight
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-orange-500 text-white hover:bg-orange-600"}
    `}
                >
                    + Add Topic
                </button>
            </div>

            {/* Added Topic List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className={`
        ${isLight ? "bg-white text-black" : "bg-[#3f4141] text-white"}
        rounded-xl shadow-md 
      `}>
                    <SortableContext
                        items={topics.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {topics.map((topic) => (
                            <QuestionCard key={topic.id} topic={topic} />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
}
