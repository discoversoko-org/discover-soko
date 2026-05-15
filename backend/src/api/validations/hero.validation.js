const validateHeroSlide = (data) => {
  const errors = [];

  /* =========================
     TITLE
  ========================= */
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length === 0
  ) {
    errors.push(
      "Title is required and must be a non-empty string"
    );
  } else if (data.title.length > 100) {
    errors.push(
      "Title must be less than 100 characters"
    );
  }

  /* =========================
     TAG (optional)
  ========================= */
  if (
    data.tag !== undefined &&
    typeof data.tag !== "string"
  ) {
    errors.push("Tag must be a string");
  } else if (data.tag && data.tag.length > 50) {
    errors.push(
      "Tag must be less than 50 characters"
    );
  }

  /* =========================
     IMAGE
  ========================= */
  if (
    data.image &&
    typeof data.image !== "object"
  ) {
    errors.push("Image must be an object");
  }

  /* =========================
     LINK TEXT
  ========================= */
  if (
    data.linkText !== undefined &&
    typeof data.linkText !== "string"
  ) {
    errors.push("Link text must be a string");
  }

  /* =========================
     LINK
  ========================= */
  if (
    data.link !== undefined &&
    typeof data.link !== "string"
  ) {
    errors.push("Link must be a string");
  }

  /* =========================
     IS ACTIVE
  ========================= */
  if (data.isActive !== undefined) {
    if (typeof data.isActive === "string") {
      if (
        data.isActive === "true"
      ) {
        data.isActive = true;
      } else if (
        data.isActive === "false"
      ) {
        data.isActive = false;
      }
    }

    if (
      typeof data.isActive !== "boolean"
    ) {
      errors.push(
        "isActive must be a boolean"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateHeroSlideUpdate = (data) => {
  const errors = [];

  /* =========================
     TITLE
  ========================= */
  if (
    data.title !== undefined &&
    (
      typeof data.title !== "string" ||
      data.title.trim().length === 0
    )
  ) {
    errors.push(
      "Title must be a non-empty string"
    );
  } else if (
    data.title &&
    data.title.length > 100
  ) {
    errors.push(
      "Title must be less than 100 characters"
    );
  }

  /* =========================
     TAG
  ========================= */
  if (
    data.tag !== undefined &&
    typeof data.tag !== "string"
  ) {
    errors.push("Tag must be a string");
  } else if (
    data.tag &&
    data.tag.length > 50
  ) {
    errors.push(
      "Tag must be less than 50 characters"
    );
  }

  /* =========================
     LINK TEXT
  ========================= */
  if (
    data.linkText !== undefined &&
    typeof data.linkText !== "string"
  ) {
    errors.push(
      "Link text must be a string"
    );
  }

  /* =========================
     LINK
  ========================= */
  if (
    data.link !== undefined &&
    typeof data.link !== "string"
  ) {
    errors.push("Link must be a string");
  }

  /* =========================
     IS ACTIVE
  ========================= */
  if (data.isActive !== undefined) {
    if (typeof data.isActive === "string") {
      if (
        data.isActive === "true"
      ) {
        data.isActive = true;
      } else if (
        data.isActive === "false"
      ) {
        data.isActive = false;
      }
    }

    if (
      typeof data.isActive !== "boolean"
    ) {
      errors.push(
        "isActive must be a boolean"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateHeroSlide,
  validateHeroSlideUpdate,
};