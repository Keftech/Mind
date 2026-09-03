// Career pathway content, keyed by department id.

export const careerPathways = {
  "geology-mining": {
    title: "Geology and Mining → GIS & Mineral Exploration",
    summary:
      "Students who combine field geology with GIS and remote sensing skills are " +
      "well positioned for exploration geology, mining tech, and geospatial data roles " +
      "across Nigerian and African mining companies.",
    skills: ["QGIS", "Python", "Remote Sensing", "Field Mapping"],
  },
};

export function getPathwayForDepartment(departmentId) {
  return careerPathways[departmentId] ?? null;
}