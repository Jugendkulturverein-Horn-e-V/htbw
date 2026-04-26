module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js");
  // CSS is processed by Tailwind separately, not passed through

  // Add date filter for blog posts
  eleventyConfig.addFilter("dateFormat", function (date) {
    const d = new Date(date);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  });

  // Add year filter
  eleventyConfig.addFilter("year", function (date) {
    return new Date(date).getFullYear();
  });

  // Filter for checking if festival has ended
  eleventyConfig.addFilter("isFestivalEnded", function (festivalEndDate) {
    const endDate = new Date(festivalEndDate);
    const now = new Date();
    return now > endDate;
  });

  // Filter to get unique years from past artists
  eleventyConfig.addFilter("getYears", function (pastArtists) {
    return Object.keys(pastArtists).sort((a, b) => b - a);
  });

  // Filter to limit array items
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  // Sort blog posts by date descending
  eleventyConfig.addFilter("sortByDate", function (posts) {
    return posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Add collection for blog posts
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Watch targets
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    // pathPrefix: "/htbw/",
  };
};
