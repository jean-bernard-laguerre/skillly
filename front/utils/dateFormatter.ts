export const formatDate = (
  dateString: string,
  format: "short" | "long" = "short"
): string => {
  if (!dateString) return "Non renseigné";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  if (format === "long") {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("fr-FR");
};

export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return date >= weekAgo;
};
