const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")

const topics = [
  ["Python Basics", [
    ["Why is Python popular in data science?", "It is readable, has a large ecosystem such as NumPy, pandas and scikit-learn, and supports fast experimentation."],
    ["What is the difference between a list and a tuple?", "Lists are mutable; tuples are immutable and can be used as dictionary keys when their contents are hashable."],
    ["What is a dictionary?", "A mutable key-value mapping with average O(1) lookup by key."],
    ["What are mutable and immutable objects?", "Mutable objects can change in place, such as lists and dictionaries. Immutable objects, such as strings and tuples, cannot."],
    ["What is a list comprehension?", "A concise way to create a list from an iterable, optionally with a filter, for example [x*x for x in values if x > 0]."],
    ["What is a lambda function?", "A small anonymous function containing one expression; use a normal def when logic needs a clear name or multiple statements."],
    ["How do you handle exceptions?", "Use try/except for expected failures, catch specific exception types, and use finally for cleanup."],
    ["What is a generator?", "An iterator that yields values lazily, reducing memory use for large sequences."],
  ]],
  ["NumPy and pandas", [
    ["Why use NumPy arrays instead of Python lists?", "Arrays use compact homogeneous storage and vectorized operations, making numerical work faster and more memory-efficient."],
    ["What is vectorization?", "Applying an operation to an entire array without an explicit Python loop."],
    ["What is broadcasting?", "NumPy's rule for performing operations on compatible arrays of different shapes."],
    ["What is a pandas DataFrame?", "A labeled two-dimensional table whose columns may have different data types."],
    ["What is the difference between loc and iloc?", "loc selects by labels; iloc selects by integer positions."],
    ["How do you handle missing values?", "First measure and understand why they are missing; then drop, impute, add an indicator, or use a model that handles missingness."],
    ["What is groupby used for?", "It follows split-apply-combine: split rows into groups, aggregate or transform each group, and combine the results."],
    ["What is the difference between merge and concat?", "merge joins using keys; concat stacks objects along rows or columns."],
    ["How do you remove duplicates?", "Use duplicated() to inspect them and drop_duplicates() after defining the correct business key."],
  ]],
  ["Statistics and Probability", [
    ["Mean, median, and mode?", "Mean is the arithmetic average, median is the middle ordered value, and mode is the most frequent value. Median is more robust to outliers."],
    ["What are variance and standard deviation?", "Variance is average squared deviation from the mean; standard deviation is its square root and uses the original unit."],
    ["What is a normal distribution?", "A symmetric bell-shaped distribution determined by its mean and variance."],
    ["What is correlation?", "A measure of association. Pearson measures linear association; correlation does not prove causation."],
    ["What is conditional probability?", "The probability of A given B: P(A|B)=P(A and B)/P(B)."],
    ["State Bayes' theorem.", "P(A|B)=P(B|A)P(A)/P(B); it updates a prior belief after observing evidence."],
    ["What is sampling bias?", "A systematic difference between the sample and target population caused by the way observations are selected."],
    ["What are null and alternative hypotheses?", "The null represents a baseline/no-effect claim; the alternative represents the effect being investigated."],
    ["What is a p-value?", "Assuming the null is true, it is the probability of a result at least as extreme as the observed one. It is not the probability that the null is true."],
    ["What is a confidence interval?", "A range produced by a method that would contain the true parameter at the stated rate over repeated samples."],
    ["Type I and Type II errors?", "Type I is rejecting a true null (false positive); Type II is failing to reject a false null (false negative)."],
    ["What is the central limit theorem?", "Under common conditions, the sampling distribution of the mean approaches normality as sample size increases."],
  ]],
  ["Data Cleaning and EDA", [
    ["What is exploratory data analysis?", "Understanding distributions, relationships, quality problems and possible leakage before modeling."],
    ["How do you detect outliers?", "Use domain rules, visualizations, IQR or robust z-scores; investigate before removing because outliers may be valid."],
    ["How do you treat categorical variables?", "Use one-hot encoding for unordered categories, ordinal encoding only for genuine order, or suitable target/frequency methods with leakage controls."],
    ["What is feature scaling?", "Putting numerical features on comparable scales. Standardization uses mean and standard deviation; normalization often maps to a fixed range."],
    ["When is scaling important?", "For distance- and gradient-based methods such as k-NN, SVM, PCA and regularized linear models; trees generally do not need it."],
    ["What is data leakage?", "Using information during training that would not be available at prediction time, causing unrealistically good validation results."],
    ["How would you begin a new dataset?", "Clarify the target and unit of observation, inspect shape/types, validate ranges and keys, study missingness/duplicates, visualize distributions, then create a leakage-safe baseline."],
  ]],
  ["Machine Learning Fundamentals", [
    ["Supervised vs unsupervised learning?", "Supervised learning predicts labeled outcomes; unsupervised learning finds structure without target labels."],
    ["Classification vs regression?", "Classification predicts categories or probabilities; regression predicts continuous values."],
    ["What is overfitting?", "The model learns training noise and performs poorly on unseen data. Control it with validation, simpler models, regularization, more data or early stopping."],
    ["What is underfitting?", "The model is too simple or insufficiently trained to capture the underlying pattern."],
    ["Explain the bias-variance trade-off.", "High bias causes underfitting; high variance causes sensitivity to training data and overfitting. Good generalization balances both."],
    ["Why split train, validation and test data?", "Train fits parameters, validation selects models/hyperparameters, and the untouched test set estimates final generalization."],
    ["What is cross-validation?", "Repeatedly training on folds and validating on the held-out fold to obtain a more stable performance estimate."],
    ["What is a baseline model?", "A simple reference such as predicting the majority class or mean; a useful model must beat it meaningfully."],
    ["What is regularization?", "A penalty that discourages excessive complexity. L1 can create sparse coefficients; L2 smoothly shrinks coefficients."],
    ["What are parameters and hyperparameters?", "Parameters are learned from data; hyperparameters are selected outside training, such as tree depth or learning rate."],
  ]],
  ["Core Algorithms", [
    ["How does linear regression work?", "It fits coefficients to minimize a loss, commonly mean squared error, assuming an approximately linear relationship."],
    ["How does logistic regression classify?", "It models log-odds as a linear function and converts them to probabilities with the sigmoid function."],
    ["How does a decision tree work?", "It recursively splits features to produce purer target groups. It is interpretable but can overfit."],
    ["Random forest vs decision tree?", "A random forest averages many decorrelated trees, usually improving stability and generalization at the cost of interpretability and compute."],
    ["What is gradient boosting?", "Trees are added sequentially, with each new tree correcting errors made by the current ensemble."],
    ["How does k-nearest neighbors work?", "It predicts using nearby training examples; it needs scaling and can be slow at prediction time."],
    ["What is an SVM?", "A model that seeks a maximum-margin boundary and can use kernels for nonlinear separation."],
    ["How does k-means clustering work?", "Assign points to the nearest centroid and update centroids repeatedly. Choose k deliberately and scale features."],
    ["What is PCA?", "A linear dimensionality-reduction method that projects centered data onto orthogonal directions of maximum variance."],
  ]],
  ["Model Evaluation", [
    ["What is a confusion matrix?", "A table of true positives, true negatives, false positives and false negatives."],
    ["Accuracy, precision and recall?", "Accuracy is overall correctness; precision is TP/(TP+FP); recall is TP/(TP+FN). Choose based on error costs."],
    ["What is F1-score?", "The harmonic mean of precision and recall, useful when classes are imbalanced and both errors matter."],
    ["What is ROC-AUC?", "The probability that a randomly selected positive is ranked above a negative across thresholds; PR-AUC is often more informative for rare positives."],
    ["MAE vs MSE vs RMSE?", "MAE is robust and easy to interpret; MSE penalizes large errors; RMSE is the square root of MSE in the target's unit."],
    ["How do you handle imbalanced classes?", "Use suitable metrics, stratified splits, class weights, careful resampling and threshold tuning based on business costs."],
    ["How do you choose a classification threshold?", "Use validation data and select the threshold that fits precision/recall requirements or expected business cost."],
  ]],
  ["SQL Basics", [
    ["WHERE vs HAVING?", "WHERE filters rows before grouping; HAVING filters groups after aggregation."],
    ["INNER JOIN vs LEFT JOIN?", "INNER returns matching rows from both tables; LEFT keeps every left row and uses NULL for missing right matches."],
    ["What does GROUP BY do?", "It groups rows so aggregate functions such as COUNT, SUM and AVG can be calculated per group."],
    ["What is a window function?", "A calculation across related rows that preserves each row, such as ROW_NUMBER or a running total."],
    ["How do you find duplicates in SQL?", "Group by the candidate key and use HAVING COUNT(*) > 1."],
    ["How do you find the second-highest salary?", "Use DENSE_RANK over salary descending and select rank 2, which handles ties explicitly."],
  ]],
  ["Projects and Behavioral", [
    ["Tell me about yourself.", "Give a 60–90 second story: current background, relevant skills/projects, measurable result, and why this role is the next step."],
    ["Explain one data science project.", "Cover problem, users, data, cleaning, baseline, model/metric choice, result, limitations and what you would improve."],
    ["Why did you choose that metric?", "Connect the metric to class balance and the real cost of false positives versus false negatives."],
    ["Describe a difficult data-quality problem.", "Use STAR: situation, task, actions used to validate/fix the data, and measurable result."],
    ["How do you explain a model to a non-technical person?", "Start with the decision and business impact, use plain language and one useful visual, then explain limitations and confidence."],
    ["What if your model performs poorly?", "Verify target/data/splits, check leakage and errors, compare with a baseline, inspect segments, improve features/data, tune carefully, and document findings."],
    ["Why should we hire a beginner?", "Emphasize strong fundamentals, evidence from projects, learning speed, clear communication and disciplined problem-solving without overstating experience."],
    ["What are your strengths and weaknesses?", "Support one relevant strength with evidence; give a genuine manageable weakness and the concrete system used to improve it."],
    ["Describe a disagreement in a team.", "Use STAR and show listening, evidence-based discussion, a shared goal and what you learned."],
    ["What questions would you ask us?", "Ask how success is measured, what data challenges the team faces, how models reach production, and what mentoring/review looks like."],
  ]],
]

const esc = value => value.replace(/[&<>]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[char]))
let number = 0
const sections = topics.map(([topic, questions]) => `<section><h2>${esc(topic)}</h2>${questions.map(([q,a]) => `<article><h3>${++number}. ${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</section>`).join("")
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:16mm 15mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;font-size:10.5pt;line-height:1.45;margin:0}header{padding:26px;background:#132a4f;color:white;border-radius:12px;margin-bottom:18px}h1{font-size:25pt;margin:0 0 7px}header p{margin:0;color:#dbe8ff}h2{font-size:17pt;color:#173e75;border-bottom:2px solid #5d8fd8;padding-bottom:5px;margin:22px 0 10px;break-after:avoid}article{break-inside:avoid;margin:0 0 10px;padding:9px 11px;background:#f5f8fc;border-left:3px solid #5d8fd8;border-radius:3px}h3{font-size:11pt;margin:0 0 4px;color:#142b4d}p{margin:0}.note{background:#fff6da;border-left:4px solid #e4a11b;padding:10px 12px;margin-bottom:18px}footer{font-size:8pt;color:#667085;text-align:center;margin-top:20px}
</style></head><body><header><h1>Beginner Data Science Interview Guide</h1><p>${number || "Comprehensive"} topic-wise basic and important questions with interview-ready answers</p></header><div class="note"><strong>How to use:</strong> Understand each answer, then explain it in your own words with an example. No finite guide can contain every possible interview question, but this covers the core beginner syllabus and common project/behavioral questions.</div>${sections}<footer>Generated as a study guide · Data Science (Beginner)</footer></body></html>`

async function main(){
  const outputDir=path.resolve(__dirname,"../../Interview-Guides")
  fs.mkdirSync(outputDir,{recursive:true})
  const browser=await puppeteer.launch({headless:true})
  try{
    const page=await browser.newPage()
    await page.setContent(html,{waitUntil:"networkidle0"})
    await page.pdf({path:path.join(outputDir,"Beginner-Data-Science-Interview-Questions-and-Answers.pdf"),format:"A4",printBackground:true,displayHeaderFooter:true,headerTemplate:"<span></span>",footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#777"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',margin:{top:"16mm",right:"15mm",bottom:"18mm",left:"15mm"}})
  }finally{await browser.close()}
  console.log(`Generated ${number} questions in ${outputDir}`)
}

main().catch(error=>{console.error(error);process.exit(1)})
