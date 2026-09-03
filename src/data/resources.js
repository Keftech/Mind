// Curated learning resources, keyed by course code.

export const resources = {
  GEY211: [
    { type: "Guide", title: "Mineral identification field guide" },
    { type: "Video", title: "Crystal systems and mineral properties" },
  ],
  GEY221: [
    { type: "Guide", title: "Reading geological maps and cross-sections" },
    { type: "Practice", title: "Fold and fault interpretation exercises" },
  ],
  GEY231: [
    { type: "Guide", title: "Sedimentary structures reference" },
    { type: "Video", title: "From sediment to sedimentary rock" },
  ],
};

export function getResourcesForCourse(courseCode) {
  return resources[courseCode] ?? [];
}
