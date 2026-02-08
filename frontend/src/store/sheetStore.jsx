import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

const useSheetStore = create(
  persist(
    (set) => ({
      topics: [],

  // ===== TOPIC CRUD =====
  addTopic: (title) =>
    set((state) => ({
      topics: [
        ...state.topics,
        {
          id: nanoid(),
          title,
          order: state.topics.length,
          subTopics: [],
        },
      ],
    })),

  editTopic: (id, title) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === id ? { ...topic, title } : topic
      ),
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((topic) => topic.id !== id),
    })),

  // ===== SUB-TOPIC CRUD =====
  addSubTopic: (topicId, title) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: [
                ...topic.subTopics,
                {
                  id: nanoid(),
                  title,
                  order: topic.subTopics.length,
                  questions: [],
                },
              ],
            }
          : topic
      ),
    })),

  editSubTopic: (topicId, subTopicId, title) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((st) =>
                st.id === subTopicId ? { ...st, title } : st
              ),
            }
          : topic
      ),
    })),

  deleteSubTopic: (topicId, subTopicId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.filter(
                (st) => st.id !== subTopicId
              ),
            }
          : topic
      ),
    })),

  // ===== QUESTION CRUD =====
  addQuestion: (topicId, subTopicId, text) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: [
                        ...st.questions,
                        {
                          id: nanoid(),
                          text,
                          order: st.questions.length,
                          status: "todo", // or "done"
                          notes: "",
                        },
                      ],
                    }
                  : st
              ),
            }
          : topic
      ),
    })),

  editQuestion: (topicId, subTopicId, questionId, updates) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.map((q) =>
                        q.id === questionId ? { ...q, ...updates } : q
                      ),
                    }
                  : st
              ),
            }
          : topic
      ),
    })),

  deleteQuestion: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.filter(
                        (q) => q.id !== questionId
                      ),
                    }
                  : st
              ),
            }
          : topic
      ),
    })),

  // ===== REORDER FUNCTIONS =====
  reorderTopics: (startIndex, endIndex) =>
    set((state) => {
      const items = Array.from(state.topics);
      const [moved] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, moved);
      return {
        topics: items.map((topic, idx) => ({ ...topic, order: idx })),
      };
    }),

  reorderSubTopics: (topicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((topic) => {
        if (topic.id !== topicId) return topic;
        const items = Array.from(topic.subTopics);
        const [moved] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, moved);
        return {
          ...topic,
          subTopics: items.map((st, idx) => ({ ...st, order: idx })),
        };
      }),
    })),

  reorderQuestions: (topicId, subTopicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          subTopics: topic.subTopics.map((st) => {
            if (st.id !== subTopicId) return st;
            const items = Array.from(st.questions);
            const [moved] = items.splice(startIndex, 1);
            items.splice(endIndex, 0, moved);
            return {
              ...st,
              questions: items.map((q, idx) => ({ ...q, order: idx })),
            };
          }),
        };
      }),
    })),

  // ===== UTILITY =====
  setTopics: (topics) => set({ topics }),
    }),
    {
      name: "prep-sheet-storage",
    }
  )
);

export default useSheetStore;