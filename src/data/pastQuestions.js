export const pastQuestionsByCourse = {
  "IBBUL-GEY218": [
    {
      type: "mcq",
      question: "Which of the following best describes a placer deposit?",
      options: [
        "A vein deposit formed by hydrothermal fluids",
        "A sedimentary concentration of dense, resistant minerals",
        "A layered igneous intrusion",
        "A skarn deposit at a contact metamorphic zone",
      ],
      correctIndex: 1,
      explanation:
        "Placer deposits are alluvial mining's core concept — dense, weathering-resistant " +
        "minerals concentrated by water transport. This shows up almost every year.",
    },
    {
      type: "theory",
      question: "Explain the process of froth flotation and its industrial significance.",
      explanation:
        "TODO — add your own explanation here once you've reviewed the actual past paper " +
        "answer expectations.",
    },
  ],
  "IBBUL-GEY216": [],
  ENT202: [],
  "IBBUL-GEY214": [],
  GEY202: [],
  GEY210: [],
  GEY212: [],
};

export function getPastQuestions(courseCode) {
  return pastQuestionsByCourse[courseCode] ?? [];
}