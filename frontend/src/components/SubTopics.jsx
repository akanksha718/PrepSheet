import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/Theme";
import useSheetStore from "../store/sheetStore";
import { Trash2, Edit3, Plus, ChevronRight, GripVertical } from "lucide-react";
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
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SubTopics({ topicId, subTopics }) {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const addSubTopic = useSheetStore((state) => state.addSubTopic);
    const editSubTopic = useSheetStore((state) => state.editSubTopic);
    const deleteSubTopic = useSheetStore((state) => state.deleteSubTopic);
    const addQuestion = useSheetStore((state) => state.addQuestion);
    const editQuestion = useSheetStore((state) => state.editQuestion);
    const deleteQuestion = useSheetStore((state) => state.deleteQuestion);
    const reorderSubTopics = useSheetStore((state) => state.reorderSubTopics);
    const reorderQuestions = useSheetStore((state) => state.reorderQuestions);

    const [isAdding, setIsAdding] = useState(false);
    const [newSubTopicTitle, setNewSubTopicTitle] = useState("");
    const [editingSubTopicId, setEditingSubTopicId] = useState(null);
    const [editingSubTopicTitle, setEditingSubTopicTitle] = useState("");
    const [expandedSubTopic, setExpandedSubTopic] = useState(null);

    // Question states
    const [addingQuestionId, setAddingQuestionId] = useState(null);
    const [newQuestionNumber, setNewQuestionNumber] = useState("");
    const [newQuestionTitle, setNewQuestionTitle] = useState("");
    const [questionError, setQuestionError] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingQuestionNumber, setEditingQuestionNumber] = useState("");
    const [editingQuestionTitle, setEditingQuestionTitle] = useState("");

    const addInputRef = useRef(null);
    const editInputRef = useRef(null);
    const addQuestionInputRef = useRef(null);
    const editQuestionInputRef = useRef(null);

    useEffect(() => {
        if (isAdding && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAdding]);

    useEffect(() => {
        if (editingSubTopicId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.setSelectionRange(editingSubTopicTitle.length, editingSubTopicTitle.length);
        }
    }, [editingSubTopicId, editingSubTopicTitle.length]);

    useEffect(() => {
        if (addingQuestionId && addQuestionInputRef.current) {
            addQuestionInputRef.current.focus();
        }
    }, [addingQuestionId]);

    useEffect(() => {
        if (editingQuestionId && editQuestionInputRef.current) {
            editQuestionInputRef.current.focus();
            editQuestionInputRef.current.setSelectionRange(editingQuestionTitle.length, editingQuestionTitle.length);
        }
    }, [editingQuestionId, editingQuestionTitle.length]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSubTopicDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = subTopics.findIndex((st) => st.id === active.id);
            const newIndex = subTopics.findIndex((st) => st.id === over.id);
            reorderSubTopics(topicId, oldIndex, newIndex);
        }
    };

    const handleQuestionDragEnd = (subTopicId) => (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const subTopic = subTopics.find((st) => st.id === subTopicId);
            const oldIndex = subTopic.questions.findIndex((q) => q.id === active.id);
            const newIndex = subTopic.questions.findIndex((q) => q.id === over.id);
            reorderQuestions(topicId, subTopicId, oldIndex, newIndex);
        }
    };

    const handleAddSubTopic = () => {
        if (newSubTopicTitle.trim()) {
            addSubTopic(topicId, newSubTopicTitle.trim());
            setNewSubTopicTitle("");
            setIsAdding(false);
        }
    };

    const handleSaveSubTopicEdit = (subTopicId) => {
        if (editingSubTopicTitle.trim()) {
            editSubTopic(topicId, subTopicId, editingSubTopicTitle.trim());
            setEditingSubTopicId(null);
            setEditingSubTopicTitle("");
        }
    };

    const handleAddSubTopicKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddSubTopic();
        } else if (e.key === "Escape") {
            setIsAdding(false);
            setNewSubTopicTitle("");
        }
    };

    const handleEditSubTopicKeyDown = (e, subTopicId) => {
        if (e.key === "Enter") {
            handleSaveSubTopicEdit(subTopicId);
        } else if (e.key === "Escape") {
            setEditingSubTopicId(null);
            setEditingSubTopicTitle("");
        }
    };

    const titleToSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleAddQuestion = (subTopicId) => {
        if (!newQuestionNumber.trim() || !newQuestionTitle.trim()) {
            setQuestionError("Please enter both question number and title");
            return;
        }
        const num = parseInt(newQuestionNumber.trim());
        if (isNaN(num) || num <= 0) {
            setQuestionError("Question number must be a valid positive number");
            return;
        }
        
        const questionText = JSON.stringify({
            number: num,
            title: newQuestionTitle.trim(),
            url: `https://leetcode.com/problems/${titleToSlug(newQuestionTitle.trim())}/`
        });
        
        addQuestion(topicId, subTopicId, questionText);
        setNewQuestionNumber("");
        setNewQuestionTitle("");
        setAddingQuestionId(null);
        setQuestionError("");
    };

    const handleSaveQuestionEdit = (subTopicId, questionId) => {
        if (!editingQuestionNumber.trim() || !editingQuestionTitle.trim()) {
            setQuestionError("Please enter both question number and title");
            return;
        }
        const num = parseInt(editingQuestionNumber.trim());
        if (isNaN(num) || num <= 0) {
            setQuestionError("Question number must be a valid positive number");
            return;
        }
        
        const questionText = JSON.stringify({
            number: num,
            title: editingQuestionTitle.trim(),
            url: `https://leetcode.com/problems/${titleToSlug(editingQuestionTitle.trim())}/`
        });
        
        editQuestion(topicId, subTopicId, questionId, { text: questionText });
        setEditingQuestionId(null);
        setEditingQuestionNumber("");
        setEditingQuestionTitle("");
        setQuestionError("");
    };

    const handleAddQuestionKeyDown = (e, subTopicId) => {
        if (e.key === "Enter") {
            handleAddQuestion(subTopicId);
        } else if (e.key === "Escape") {
            setAddingQuestionId(null);
            setNewQuestionNumber("");
            setNewQuestionTitle("");
            setQuestionError("");
        }
    };

    const handleEditQuestionKeyDown = (e, subTopicId, questionId) => {
        if (e.key === "Enter") {
            handleSaveQuestionEdit(subTopicId, questionId);
        } else if (e.key === "Escape") {
            setEditingQuestionId(null);
            setEditingQuestionNumber("");
            setEditingQuestionTitle("");
            setQuestionError("");
        }
    };

    return (
        <div className={`pl-6 py-2 space-y-2`}>
            {/* Add SubTopic Section */}
            <div className="flex items-center gap-2">
                {isAdding ? (
                    <input
                        ref={addInputRef}
                        type="text"
                        value={newSubTopicTitle}
                        onChange={(e) => setNewSubTopicTitle(e.target.value)}
                        onBlur={handleAddSubTopic}
                        onKeyDown={handleAddSubTopicKeyDown}
                        placeholder="Enter subtopic name..."
                        className={`
                            flex-1 px-3 py-1 rounded text-sm outline-none
                            ${
                                isLight
                                    ? "border border-gray-300 bg-white text-black"
                                    : "border border-gray-600 bg-gray-700 text-white"
                            }
                        `}
                    />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className={`
                            flex items-center gap-2 px-3 py-1 rounded text-sm transition
                            ${
                                isLight
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "bg-orange-500 text-white hover:bg-orange-600"
                            }
                        `}
                    >
                        <Plus size={16} />
                        Add Subtopic
                    </button>
                )}
            </div>

            {/* SubTopics List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSubTopicDragEnd}
            >
                <SortableContext
                    items={subTopics.map((st) => st.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-1">
                        {subTopics.map((subTopic) => (
                            <SortableSubTopic
                                key={subTopic.id}
                                subTopic={subTopic}
                                topicId={topicId}
                                isLight={isLight}
                                expandedSubTopic={expandedSubTopic}
                                setExpandedSubTopic={setExpandedSubTopic}
                                editingSubTopicId={editingSubTopicId}
                                setEditingSubTopicId={setEditingSubTopicId}
                                editingSubTopicTitle={editingSubTopicTitle}
                                setEditingSubTopicTitle={setEditingSubTopicTitle}
                                editInputRef={editInputRef}
                                handleSaveSubTopicEdit={handleSaveSubTopicEdit}
                                handleEditSubTopicKeyDown={handleEditSubTopicKeyDown}
                                deleteSubTopic={deleteSubTopic}
                                addingQuestionId={addingQuestionId}
                                setAddingQuestionId={setAddingQuestionId}
                                newQuestionNumber={newQuestionNumber}
                                setNewQuestionNumber={setNewQuestionNumber}
                                newQuestionTitle={newQuestionTitle}
                                setNewQuestionTitle={setNewQuestionTitle}
                                questionError={questionError}
                                setQuestionError={setQuestionError}
                                addQuestionInputRef={addQuestionInputRef}
                                handleAddQuestion={handleAddQuestion}
                                handleAddQuestionKeyDown={handleAddQuestionKeyDown}
                                editingQuestionId={editingQuestionId}
                                setEditingQuestionId={setEditingQuestionId}
                                editingQuestionNumber={editingQuestionNumber}
                                setEditingQuestionNumber={setEditingQuestionNumber}
                                editingQuestionTitle={editingQuestionTitle}
                                setEditingQuestionTitle={setEditingQuestionTitle}
                                editQuestionInputRef={editQuestionInputRef}
                                handleSaveQuestionEdit={handleSaveQuestionEdit}
                                handleEditQuestionKeyDown={handleEditQuestionKeyDown}
                                deleteQuestion={deleteQuestion}
                                handleQuestionDragEnd={handleQuestionDragEnd}
                                sensors={sensors}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

// Sortable SubTopic Component
function SortableSubTopic({
    subTopic,
    topicId,
    isLight,
    expandedSubTopic,
    setExpandedSubTopic,
    editingSubTopicId,
    setEditingSubTopicId,
    editingSubTopicTitle,
    setEditingSubTopicTitle,
    editInputRef,
    handleSaveSubTopicEdit,
    handleEditSubTopicKeyDown,
    deleteSubTopic,
    addingQuestionId,
    setAddingQuestionId,
    newQuestionNumber,
    setNewQuestionNumber,
    newQuestionTitle,
    setNewQuestionTitle,
    questionError,
    setQuestionError,
    addQuestionInputRef,
    handleAddQuestion,
    handleAddQuestionKeyDown,
    editingQuestionId,
    setEditingQuestionId,
    editingQuestionNumber,
    setEditingQuestionNumber,
    editingQuestionTitle,
    setEditingQuestionTitle,
    editQuestionInputRef,
    handleSaveQuestionEdit,
    handleEditQuestionKeyDown,
    deleteQuestion,
    handleQuestionDragEnd,
    sensors,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: subTopic.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* SubTopic Header */}
            <div
                className={`
                    flex items-center gap-2 p-2 rounded cursor-pointer transition
                    ${
                        isLight
                            ? "hover:bg-gray-100"
                            : "hover:bg-[#404141]"
                    }
                `}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300"
                    title="Drag to reorder"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={14} />
                </button>
                
                <ChevronRight
                    size={16}
                    onClick={() =>
                        setExpandedSubTopic(
                            expandedSubTopic === subTopic.id
                                ? null
                                : subTopic.id
                        )
                    }
                    className={`text-orange-500 transition-transform ${
                        expandedSubTopic === subTopic.id
                            ? "rotate-90"
                            : ""
                    }`}
                />

                {editingSubTopicId === subTopic.id ? (
                    <input
                        ref={editInputRef}
                        type="text"
                        value={editingSubTopicTitle}
                        onChange={(e) =>
                            setEditingSubTopicTitle(e.target.value)
                        }
                        onBlur={() =>
                            handleSaveSubTopicEdit(subTopic.id)
                        }
                        onKeyDown={(e) =>
                            handleEditSubTopicKeyDown(
                                e,
                                subTopic.id
                            )
                        }
                        className={`
                            flex-1 px-2 py-1 rounded text-sm outline-none
                            ${
                                isLight
                                    ? "border border-gray-300 bg-white text-black"
                                    : "border border-gray-600 bg-gray-700 text-white"
                            }
                        `}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span 
                        className="flex-1 text-sm font-medium"
                        onClick={() =>
                            setExpandedSubTopic(
                                expandedSubTopic === subTopic.id
                                    ? null
                                    : subTopic.id
                            )
                        }
                    >
                        {subTopic.title}
                    </span>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingSubTopicId(subTopic.id);
                            setEditingSubTopicTitle(
                                subTopic.title
                            );
                        }}
                        className={`
                            p-1 rounded transition
                            ${
                                isLight
                                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                            }
                        `}
                        title="Edit subtopic"
                    >
                        <Edit3 size={16} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSubTopic(topicId, subTopic.id);
                        }}
                        className={`
                            p-1 rounded transition
                            ${
                                isLight
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-100"
                                    : "text-red-500 hover:text-red-400 hover:bg-red-900/20"
                            }
                        `}
                        title="Delete subtopic"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Questions Section (when expanded) */}
            {expandedSubTopic === subTopic.id && (
                <div
                    className={`pl-8 py-2 space-y-2 ${
                        isLight
                            ? "text-gray-700"
                            : "text-gray-400"
                    }`}
                >
                    {/* Add Question Button/Input */}
                    <div className="flex items-center gap-2">
                        {addingQuestionId === subTopic.id ? (
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        ref={addQuestionInputRef}
                                        type="text"
                                        value={newQuestionNumber}
                                        onChange={(e) =>
                                            setNewQuestionNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Question #"
                                        className={`
                                            w-24 px-2 py-1 rounded text-sm outline-none
                                            ${
                                                isLight
                                                    ? "border border-gray-300 bg-white text-black"
                                                    : "border border-gray-600 bg-gray-700 text-white"
                                            }
                                        `}
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    />
                                    <input
                                        type="text"
                                        value={newQuestionTitle}
                                        onChange={(e) =>
                                            setNewQuestionTitle(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleAddQuestionKeyDown(
                                                e,
                                                subTopic.id
                                            )
                                        }
                                        placeholder="Question title"
                                        className={`
                                            flex-1 px-3 py-1 rounded text-sm outline-none
                                            ${
                                                isLight
                                                    ? "border border-gray-300 bg-white text-black"
                                                    : "border border-gray-600 bg-gray-700 text-white"
                                            }
                                        `}
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    />
                                </div>
                                {questionError && (
                                    <p className="text-red-500 text-xs">
                                        {questionError}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAddingQuestionId(
                                        subTopic.id
                                    );
                                    setQuestionError("");
                                }}
                                className={`
                                    flex items-center gap-2 px-3 py-1 rounded text-sm transition
                                    ${
                                        isLight
                                            ? "bg-slate-900 text-white hover:bg-slate-800"
                                            : "bg-orange-500 text-white hover:bg-orange-600"
                                    }
                                `}
                            >
                                <Plus size={14} />
                                Add Question
                            </button>
                        )}
                    </div>

                    {/* Questions List */}
                    {subTopic.questions &&
                    subTopic.questions.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleQuestionDragEnd(subTopic.id)}
                        >
                            <SortableContext
                                items={subTopic.questions.map((q) => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-1">
                                    {subTopic.questions.map(
                                        (question) => (
                                            <SortableQuestion
                                                key={question.id}
                                                question={question}
                                                subTopic={subTopic}
                                                topicId={topicId}
                                                isLight={isLight}
                                                editingQuestionId={editingQuestionId}
                                                setEditingQuestionId={setEditingQuestionId}
                                                editingQuestionNumber={editingQuestionNumber}
                                                setEditingQuestionNumber={setEditingQuestionNumber}
                                                editingQuestionTitle={editingQuestionTitle}
                                                setEditingQuestionTitle={setEditingQuestionTitle}
                                                editQuestionInputRef={editQuestionInputRef}
                                                handleSaveQuestionEdit={handleSaveQuestionEdit}
                                                handleEditQuestionKeyDown={handleEditQuestionKeyDown}
                                                deleteQuestion={deleteQuestion}
                                                setQuestionError={setQuestionError}
                                            />
                                        )
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <p className="text-xs italic opacity-70">
                            No questions yet. Add questions here.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// Sortable Question Component
function SortableQuestion({
    question,
    subTopic,
    topicId,
    isLight,
    editingQuestionId,
    setEditingQuestionId,
    editingQuestionNumber,
    setEditingQuestionNumber,
    editingQuestionTitle,
    setEditingQuestionTitle,
    editQuestionInputRef,
    handleSaveQuestionEdit,
    handleEditQuestionKeyDown,
    deleteQuestion,
    setQuestionError,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                flex items-center gap-2 p-2 rounded transition
                ${
                    isLight
                        ? "hover:bg-gray-100"
                        : "hover:bg-[#404141]"
                }
            `}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical size={12} />
            </button>

            {editingQuestionId ===
            question.id ? (
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <input
                            ref={editQuestionInputRef}
                            type="text"
                            value={editingQuestionNumber}
                            onChange={(e) =>
                                setEditingQuestionNumber(
                                    e.target.value
                                )
                            }
                            placeholder="Question #"
                            className={`
                                w-24 px-2 py-1 rounded text-sm outline-none
                                ${
                                    isLight
                                        ? "border border-gray-300 bg-white text-black"
                                        : "border border-gray-600 bg-gray-700 text-white"
                                }
                            `}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />
                        <input
                            type="text"
                            value={editingQuestionTitle}
                            onChange={(e) =>
                                setEditingQuestionTitle(
                                    e.target.value
                                )
                            }
                            onBlur={() =>
                                handleSaveQuestionEdit(
                                    subTopic.id,
                                    question.id
                                )
                            }
                            onKeyDown={(e) =>
                                handleEditQuestionKeyDown(
                                    e,
                                    subTopic.id,
                                    question.id
                                )
                            }
                            placeholder="Question title"
                            className={`
                                flex-1 px-3 py-1 rounded text-sm outline-none
                                ${
                                    isLight
                                        ? "border border-gray-300 bg-white text-black"
                                        : "border border-gray-600 bg-gray-700 text-white"
                                }
                            `}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />
                    </div>
                </div>
            ) : (
                (() => {
                    try {
                        const questionData = JSON.parse(question.text);
                        return (
                            <a
                                href={questionData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 text-sm font-medium underline transition ${
                                    isLight
                                        ? "text-blue-600 hover:text-blue-800"
                                        : "text-blue-400 hover:text-blue-300"
                                }`}
                            >
                                #{questionData.number} - {questionData.title}
                            </a>
                        );
                    } catch {
                        return (
                            <span className="flex-1 text-sm">
                                {question.text}
                            </span>
                        );
                    }
                })()
            )}

            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingQuestionId(
                            question.id
                        );
                        try {
                            const questionData = JSON.parse(question.text);
                            setEditingQuestionNumber(
                                String(questionData.number)
                            );
                            setEditingQuestionTitle(
                                questionData.title
                            );
                        } catch {
                            setEditingQuestionNumber("");
                            setEditingQuestionTitle(question.text);
                        }
                        setQuestionError("");
                    }}
                    className={`
                        p-1 rounded transition
                        ${
                            isLight
                                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        }
                    `}
                    title="Edit question"
                >
                    <Edit3 size={14} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(
                            topicId,
                            subTopic.id,
                            question.id
                        );
                    }}
                    className={`
                        p-1 rounded transition
                        ${
                            isLight
                                ? "text-red-600 hover:text-red-700 hover:bg-red-100"
                                : "text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        }
                    `}
                    title="Delete question"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
