-- ============================================================
-- EDTECH LMS SEED DATA (ANALYTICS WITH ANNU 5-STAGE CURRICULUM)
-- ============================================================

-- 1. SEED COURSES
INSERT INTO public.courses (id, slug, title, description, category, price, original_price, thumbnail, instructor_name, instructor_role, difficulty, duration, published)
VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'data-analyst',
  'Data Analyst',
  'Master Excel, SQL, Python, Pandas, Matplotlib, Power BI, and Exploratory Data Analysis to drive strategic business decisions.',
  'Data',
  1999,
  5999,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'Shaik Anwar',
  'Senior Data Scientist',
  'Beginner',
  '40 Hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000002',
  'data-science',
  'Data Science',
  'Comprehensive pathway covering Advanced Python, Statistics, Machine Learning Algorithms, Feature Engineering, and Predictive Analytics.',
  'Data',
  2499,
  7999,
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
  'Shaik Anwar',
  'Senior Data Scientist',
  'Intermediate',
  '65 Hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000003',
  'ai-ml-engineer',
  'AI / ML Engineer',
  'Deep dive into Linear Algebra, Optimization, Supervised & Unsupervised Learning, Neural Networks, PyTorch, and Hugging Face.',
  'AI & ML',
  2999,
  9999,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  'Shaik Anwar',
  'Senior Data Scientist',
  'Intermediate',
  '80 Hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000004',
  'genai-engineer',
  'GenAI Engineer',
  'Build cutting-edge AI chatbots, Document Q&A systems, and Prompt Engineering workflows using OpenAI, Gemini, Claude, and Ollama.',
  'Generative AI',
  3499,
  11999,
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
  'Shaik Anwar',
  'Senior Data Scientist',
  'Advanced',
  '75 Hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000005',
  'agentic-ai-engineer',
  'Agentic AI Engineer',
  'Master RAG architectures, Vector Databases (Pinecone, Chroma), LangChain, LangGraph stateful multi-agent systems, and MCP tools.',
  'Agentic AI',
  3999,
  14999,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  'Shaik Anwar',
  'Senior Data Scientist',
  'Advanced',
  '90 Hours',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 2. SEED MODULES FOR DATA ANALYST
INSERT INTO public.course_modules (id, course_id, title, description, "order")
VALUES
(
  'b0000000-0000-0000-0000-000000000101',
  'a0000000-0000-0000-0000-000000000001',
  'Module 1: Excel & Business Reporting',
  'Pivot Tables, XLOOKUP, INDEX MATCH, Data Cleaning, and Dashboard Creation.',
  1
),
(
  'b0000000-0000-0000-0000-000000000102',
  'a0000000-0000-0000-0000-000000000001',
  'Module 2: SQL & Relational Databases',
  'SQL Queries, Filtering, Joins, Subqueries, CTEs, and Window Functions.',
  2
),
(
  'b0000000-0000-0000-0000-000000000103',
  'a0000000-0000-0000-0000-000000000001',
  'Module 3: Python for Data Analysis',
  'NumPy Arrays, Pandas DataFrames, Data Cleaning, GroupBy, and Visualization.',
  3
),
(
  'b0000000-0000-0000-0000-000000000104',
  'a0000000-0000-0000-0000-000000000001',
  'Module 4: Power BI & Business Intelligence',
  'Data Modeling, Star Schema, DAX Measures, and Interactive BI Reports.',
  4
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED LESSONS FOR DATA ANALYST MODULES
INSERT INTO public.lessons (id, module_id, course_id, title, description, video_url, duration, "order", is_preview)
VALUES
(
  'c0000000-0000-0000-0000-000000001001',
  'b0000000-0000-0000-0000-000000000101',
  'a0000000-0000-0000-0000-000000000001',
  'Lesson 1.1: Excel Advanced Formulas (VLOOKUP & XLOOKUP)',
  'Master lookup functions and error handling in enterprise spreadsheets.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '18 mins',
  1,
  true
),
(
  'c0000000-0000-0000-0000-000000001002',
  'b0000000-0000-0000-0000-000000000101',
  'a0000000-0000-0000-0000-000000000001',
  'Lesson 1.2: Pivot Tables & Dynamic Dashboards',
  'Build executive KPI summaries with slicers and calculated fields.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '24 mins',
  2,
  false
),
(
  'c0000000-0000-0000-0000-000000001003',
  'b0000000-0000-0000-0000-000000000102',
  'a0000000-0000-0000-0000-000000000001',
  'Lesson 2.1: SQL Joins & Subqueries',
  'Inner, Left, Right, and Full Outer Joins for complex multi-table queries.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '25 mins',
  1,
  false
),
(
  'c0000000-0000-0000-0000-000000001004',
  'b0000000-0000-0000-0000-000000000102',
  'a0000000-0000-0000-0000-000000000001',
  'Lesson 2.2: Window Functions & CTEs',
  'ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD() and Common Table Expressions.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   me30 mins',
  2,
  false
)
ON CONFLICT (id) DO NOTHING;
