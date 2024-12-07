const math = require('mathjs');

class EducationMetrics {
  // Student-side metrics

  /**
   * Calculate topic mastery based on different assessment scores and weights
   * @param {Object[]} assessments - Array of assessment objects
   * @param {Object} weights - Weights for different assessment types
   * @returns {number} Topic mastery score
   */
  static calculateTopicMastery(assessments, weights = {
    exam: 0.5,
    quiz: 0.3,
    homework: 0.2
  }) {
    return assessments.reduce((total, assessment) => {
      const weight = weights[assessment.type] || 1;
      return total + (assessment.score * weight);
    }, 0);
  }

  /**
   * Calculate query analytics with recency and complexity weighting
   * @param {Object[]} queries - Array of query objects
   * @returns {number} Weighted query score
   */
  static calculateQueryAnalytics(queries) {
    const totalWeights = queries.reduce((sum, query, index) => {
      const recencyWeight = Math.exp(-index / 120);
      const complexityWeight = 1 + (query.complexity - 3) / 2;
      return sum + (recencyWeight * complexityWeight);
    }, 0);

    const weightedScore = queries.reduce((total, query, index) => {
      const recencyWeight = Math.exp(-index / 120);
      const complexityWeight = 1 + (query.complexity - 3) / 2;
      return total + (query.score * recencyWeight * complexityWeight);
    }, 0);

    return weightedScore / totalWeights;
  }

  /**
   * Calculate complexity growth for queries
   * @param {Object[]} queries - Array of query objects
   * @param {number} windowSize - Number of queries to analyze
   * @returns {Object} Complexity growth metrics
   */
  static calculateComplexityGrowth(queries, windowSize = 5) {
    if (queries.length < windowSize * 2) {
      return { complexityGrowth: 0, levelChange: 0 };
    }

    const initialQueries = queries.slice(0, windowSize);
    const currentQueries = queries.slice(-windowSize);

    const initialAvgComplexity = initialQueries.reduce((sum, q) => sum + q.complexity, 0) / windowSize;
    const currentAvgComplexity = currentQueries.reduce((sum, q) => sum + q.complexity, 0) / windowSize;

    const complexityGrowth = ((currentAvgComplexity - initialAvgComplexity) / initialAvgComplexity) * 100;
    const levelChange = currentAvgComplexity - initialAvgComplexity;

    return { complexityGrowth, levelChange };
  }

  // Professor-side metrics

  /**
   * Calculate class-wide topic mastery
   * @param {Object[]} studentTopicMasteries - Array of individual student topic masteries
   * @returns {number} Class average topic mastery
   */
  static calculateClassTopicAverage(studentTopicMasteries) {
    return studentTopicMasteries.reduce((sum, mastery) => sum + mastery, 0) / studentTopicMasteries.length;
  }

  /**
   * Calculate average query complexity for a class
   * @param {Object[]} queries - Array of query objects
   * @returns {number} Average query complexity
   */
  static calculateAverageQueryComplexity(queries) {
    return queries.reduce((sum, query) => sum + query.complexity, 0) / queries.length;
  }

  /**
   * Identify worst-performing topics
   * @param {Object[]} topicScores - Array of topic performance scores
   * @param {number} numTopics - Number of worst topics to return
   * @returns {Object[]} Lowest performing topics
   */
  static findWorstPerformingTopics(topicScores, numTopics = 3) {
    return topicScores
      .sort((a, b) => a.score - b.score)
      .slice(0, numTopics);
  }
}

module.exports = EducationMetrics;