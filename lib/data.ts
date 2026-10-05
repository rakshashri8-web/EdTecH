import { Course, LearningStage, ProjectItem } from './types';

export const INSTRUCTOR_INFO = {
  name: "Shaik Anwar",
  role: "Senior Data Scientist",
  program: "Analytics with Annu",
  bio: "Industry expert with 10+ years in Data Science, Machine Learning, and Generative AI. Has trained over 10,000+ students and professionals to become job-ready engineers.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
};

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 1,
    title: "Stage 1 — Computational Foundation",
    subtitle: "Python, SQL, Math & Statistics",
    description: "Master programming fundamentals, advanced OOP, SQL querying, calculus, linear algebra, and statistical hypothesis testing essential for tech careers.",
    topics: [
      "Python Fundamentals (Variables, Loops, Functions, Lists, Sets, Dictionaries, Exception Handling)",
      "Advanced Python (OOP, Inheritance, Polymorphism, AsyncIO, Virtual Envs, Modular Structure)",
      "SQL & Databases (Joins, Subqueries, CTEs, Window Functions, Indexing, Transactions, ACID)",
      "Statistics & Mathematics (Probability, Hypothesis Testing, Confidence Intervals, Gradients, Loss Functions)"
    ],
    skills: ["Programming Logic", "Database Design", "Statistical Reasoning", "Linear Algebra"],
    technologies: ["Python", "SQL", "PostgreSQL", "Jupyter", "Git"],
    relatedCourses: ["Data Analyst", "Data Science", "AI / ML Engineer"],
    projects: ["Retail Analytics System"],
    prerequisites: ["Basic computer literacy", "Interest in data analysis"],
    outcomes: ["Write clean Python scripts", "Query multi-table databases", "Perform statistical A/B testing"]
  },
  {
    id: 2,
    title: "Stage 2 — Data Analytics",
    subtitle: "Excel, Pandas, Visualization & Power BI",
    description: "Transform raw data into business strategy using industry tools, building dynamic KPI dashboards, automated reporting, and exploratory data pipelines.",
    topics: [
      "Excel Automation (Pivot Tables, VLOOKUP, XLOOKUP, INDEX MATCH, Business Reporting)",
      "NumPy & Pandas (Arrays, DataFrames, Data Cleaning, GroupBy, Merging, Time Series)",
      "Data Visualization (Matplotlib, Seaborn, Plotly, KPI Dashboards, Business Storytelling)",
      "Power BI / Tableau (Data Modeling, Star Schema, DAX Measures, Row-Level Security)",
      "EDA (Data Profiling, Outlier Detection, Feature Extraction & Business Insights)"
    ],
    skills: ["Data Wrangling", "Dashboard Design", "Business Reporting", "Exploratory Analytics"],
    technologies: ["Excel", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Power BI", "Tableau"],
    relatedCourses: ["Data Analyst", "Data Science"],
    projects: ["Retail Analytics System", "Telecom Churn Prediction"],
    prerequisites: ["Stage 1 Python & SQL basics"],
    outcomes: ["Build executive Power BI dashboards", "Clean messy datasets with Pandas", "Uncover operational cost savings"]
  },
  {
    id: 3,
    title: "Stage 3 — Machine Learning",
    subtitle: "Supervised, Unsupervised & Deep Learning",
    description: "Build, evaluate, and tune robust machine learning and neural network models using Scikit-Learn, XGBoost, TensorFlow, and PyTorch.",
    topics: [
      "ML Fundamentals (Supervised, Unsupervised, Regression, Classification, Clustering)",
      "ML Algorithms (Linear/Logistic, Random Forests, XGBoost, SVM, KNN, PCA)",
      "Feature Engineering (Scaling, Encoding, Cross-Validation, Imbalanced Data, Pipelines)",
      "Deep Learning & Frameworks (Neural Networks, CNN, RNN, LSTM, PyTorch, Hugging Face)"
    ],
    skills: ["Predictive Modeling", "Model Evaluation", "Hyperparameter Tuning", "Deep Neural Networks"],
    technologies: ["Scikit-Learn", "XGBoost", "TensorFlow", "PyTorch", "Hugging Face"],
    relatedCourses: ["Data Science", "AI / ML Engineer"],
    projects: ["Telecom Churn Prediction", "Fraud Detection System", "Recommendation Engine"],
    prerequisites: ["Stage 2 Data Wrangling & Statistics"],
    outcomes: ["Deploy churn prediction classifiers", "Train PyTorch neural networks", "Prevent data leakage in ML pipelines"]
  },
  {
    id: 4,
    title: "Stage 4 — Generative AI & LLM Engineering",
    subtitle: "LLMs, Prompt Engineering & Model Serving",
    description: "Architect AI applications using Transformer models, OpenAI, Gemini, Claude, and local open-source LLMs like Ollama and vLLM.",
    topics: [
      "Generative AI Fundamentals (Transformers, Tokenization, Embeddings, Sampling, Temperature)",
      "Prompt Engineering (Few-Shot, Chain-of-Thought, JSON Output, AI Safety, Evaluation)",
      "LLM Engineering (OpenAI, Gemini, Claude APIs, Local LLMs, Ollama, vLLM, Streaming)",
      "AI Application Development (Chatbots, AI Assistants, Document Q&A, Intelligent Search)"
    ],
    skills: ["LLM Integration", "Prompt Design", "Embedding Generation", "Local Model Deployment"],
    technologies: ["OpenAI API", "Gemini API", "Claude API", "Ollama", "vLLM", "Hugging Face"],
    relatedCourses: ["GenAI Engineer", "Agentic AI Engineer"],
    projects: ["Enterprise RAG Chatbot", "AI Resume Screening Agent", "AI SQL Assistant"],
    prerequisites: ["Stage 3 Machine Learning & Python API Integration"],
    outcomes: ["Deploy local LLMs with vLLM", "Design structured JSON prompt systems", "Build streaming AI assistants"]
  },
  {
    id: 5,
    title: "Stage 5 — RAG, LangChain & Agentic AI",
    subtitle: "LangGraph, Multi-Agent Workflows & MCP",
    description: "Create autonomous, tool-using AI agents, stateful multi-agent orchestrations, vector search engines, and enterprise Model Context Protocol workflows.",
    topics: [
      "RAG Architecture (Embeddings, Hybrid Search, Chunking, Re-ranking, Context Compression)",
      "Vector Databases (FAISS, Pinecone, ChromaDB, Weaviate)",
      "LangChain & LCEL (Chains, Memory, Tool Calling, Retrievers, Output Parsers)",
      "LangGraph & Agentic AI (Stateful Workflows, Multi-Agent Collaboration, Human-in-the-Loop, MCP)"
    ],
    skills: ["Agentic Orchestration", "Vector Indexing", "Tool Calling", "Stateful Graph Workflows"],
    technologies: ["LangChain", "LangGraph", "Pinecone", "ChromaDB", "FAISS", "MCP"],
    relatedCourses: ["Agentic AI Engineer", "GenAI Engineer"],
    projects: ["AI Customer Support Bot", "Multi-Agent AI Workflow", "Voice AI Assistant"],
    prerequisites: ["Stage 4 LLM Engineering & Embeddings"],
    outcomes: ["Orchestrate multi-agent LangGraph teams", "Implement vector semantic search", "Build autonomous tool-using agents"]
  }
];

export const PROJECTS_LIST: ProjectItem[] = [
  {
    "id": 1,
    "slug": "retail-analytics-system",
    "name": "Retail Analytics System",
    "course": "Data Analyst",
    "course_slug": "data-analyst",
    "project_order": 1,
    "skills": [
      "Excel",
      "SQL",
      "Python",
      "Pandas",
      "Power BI",
      "Data Visualization"
    ],
    "difficulty": "Beginner",
    "description": "End-to-end retail sales intelligence platform with automated KPI dashboards, customer segmentation, and inventory optimization.",
    "problem_statement": "Analyze retail store sales data to identify useful trends, customer purchasing behavior, and inventory bottlenecks across 50 regional branches.",
    "real_world_use_case": "Enables retail store managers and executive VPs to optimize stock reorder points, target high-value customer segments, and increase profit margins.",
    "required_modules": [
      "✓ Excel",
      "✓ SQL",
      "✓ Python",
      "✓ Pandas",
      "✓ Data Visualization",
      "✓ EDA"
    ],
    "technologies": [
      "Excel",
      "SQL",
      "Python",
      "Pandas",
      "Matplotlib",
      "Power BI"
    ],
    "build_requirements": [
      "Query multi-store transactions using SQL CTEs and JOINs.",
      "Clean raw store sales CSVs in Pandas, treating missing items and outliers.",
      "Build a Star Schema data model in Power BI with DAX total revenue & month-over-month growth measures.",
      "Publish an interactive dashboard with drill-through store filters."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "What primary business problem does the Retail Analytics System address?",
        "options": [
          "Analyzing retail transaction data to optimize store inventory and target high-value customer segments",
          "Training a neural network to generate fake store receipts",
          "Creating a local web server for store cash registers",
          "Automating email responses to store customer complaints"
        ],
        "correctIndex": 0,
        "explanation": "The project analyzes store data to improve inventory visibility and customer promotion targeting."
      },
      {
        "id": "q2",
        "section": "Section 2 — Modules Used",
        "question": "Which course modules were directly utilized to build this analytics platform?",
        "options": [
          "Excel, SQL, Python, Pandas, Matplotlib, and Power BI",
          "PyTorch, Quantum Computing, C++, and Assembly Language",
          "Photoshop, Video Editing, and Audio Recording",
          "None of the course modules"
        ],
        "correctIndex": 0,
        "explanation": "The project combines Excel data modeling, SQL database querying, Pandas data cleaning, and Power BI dashboarding."
      },
      {
        "id": "q3",
        "section": "Section 3 — Technologies Selected",
        "question": "Why is Power BI DAX used instead of raw Excel formulas for large retail datasets?",
        "options": [
          "DAX operates on compressed in-memory columnar data models for fast aggregations across millions of rows",
          "Excel formulas cannot perform addition",
          "Power BI requires no code whatsoever",
          "DAX only works with Python code"
        ],
        "correctIndex": 0,
        "explanation": "DAX utilizes VertiPaq columnar compression for fast aggregations over millions of rows."
      },
      {
        "id": "q4",
        "section": "Section 4 — Implementation Approach",
        "question": "What does `df.groupby('store_id')['sales'].sum()` accomplish in Pandas?",
        "options": [
          "Calculates total sales revenue per individual store ID",
          "Deletes all rows containing zero sales",
          "Sorts the dataset alphabetically by store name",
          "Exports the dataset to a PDF file"
        ],
        "correctIndex": 0,
        "explanation": "Groupby aggregates sales revenue grouped by unique store_id."
      },
      {
        "id": "q5",
        "section": "Section 5 — Real-World Adjustments",
        "question": "If regional store managers report slow dashboard load times, what optimization should you apply first?",
        "options": [
          "Optimize DAX measures and enforce a Star Schema with single-direction relationships",
          "Delete half of the store sales records",
          "Change font colors",
          "Reinstall the operating system"
        ],
        "correctIndex": 0,
        "explanation": "Star schema relationships minimize query processing overhead in BI columnar engines."
      }
    ]
  },
  {
    "id": 2,
    "slug": "telecom-churn-prediction",
    "name": "Telecom Churn Prediction",
    "course": "Data Analyst",
    "course_slug": "data-analyst",
    "project_order": 2,
    "skills": [
      "Python",
      "SQL",
      "Pandas",
      "Scikit-Learn",
      "EDA",
      "Classification"
    ],
    "difficulty": "Intermediate",
    "description": "Predictive model identifying at-risk customer segments with 92% accuracy to enable proactive retention campaigns.",
    "problem_statement": "Predict subscribers who are likely to leave a telecom service using historical contract type, monthly charges, and usage trends.",
    "real_world_use_case": "Allows marketing and customer success teams to deploy targeted discount offers to high-risk churn subscribers before they cancel.",
    "required_modules": [
      "✓ Python",
      "✓ Data Preprocessing",
      "✓ Feature Scaling",
      "✓ Classification",
      "✓ EDA"
    ],
    "technologies": [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Seaborn"
    ],
    "build_requirements": [
      "Perform exploratory data analysis to detect correlations between contract type, monthly charges, and churn.",
      "Preprocess categorical variables using One-Hot Encoding and scale numeric features.",
      "Handle class imbalance using SMOTE (Synthetic Minority Over-sampling Technique).",
      "Train Logistic Regression, Random Forest, and XGBoost classifiers; evaluate using ROC-AUC and Recall."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "Why is Recall a more critical evaluation metric than Accuracy for churn prediction?",
        "options": [
          "Failing to identify a churning customer (False Negative) costs far more than sending a retention offer to a loyal subscriber",
          "Accuracy cannot be calculated on binary classifications",
          "Recall is always 100%",
          "Telecom companies only care about total subscriber counts"
        ],
        "correctIndex": 0,
        "explanation": "High recall minimizes missed churning subscribers, saving high acquisition costs."
      },
      {
        "id": "q2",
        "section": "Section 2 — Modules Used",
        "question": "Which modules from the Data Analyst curriculum were applied to pre-process the customer data?",
        "options": [
          "Python, Data Preprocessing, Feature Scaling, Classification, and EDA",
          "3D Animation, Hardware Assembly, and Web Design",
          "Only Excel formulas",
          "No modules were used"
        ],
        "correctIndex": 0,
        "explanation": "Data preprocessing, feature scaling, classification, and EDA modules prepare messy subscriber data for modeling."
      }
    ]
  },
  {
    "id": 3,
    "slug": "fraud-detection-system",
    "name": "Fraud Detection System",
    "course": "Data Science",
    "course_slug": "data-science",
    "project_order": 1,
    "skills": [
      "Advanced ML",
      "SMOTE Class Imbalance",
      "Feature Engineering",
      "Scikit-Learn",
      "Model Metrics"
    ],
    "difficulty": "Advanced",
    "description": "Real-time financial transaction risk rating system handling high-frequency imbalanced payment streams.",
    "problem_statement": "Detect fraudulent credit card transactions buried in high-volume imbalanced financial payment streams (0.1% fraud rate).",
    "real_world_use_case": "Flags fraudulent payment transactions in milliseconds before authorizations are completed.",
    "required_modules": [
      "✓ Advanced Machine Learning",
      "✓ SMOTE Class Imbalance",
      "✓ Feature Engineering",
      "✓ Model Metrics"
    ],
    "technologies": [
      "Python",
      "Pandas",
      "Scikit-Learn",
      "XGBoost",
      "Seaborn"
    ],
    "build_requirements": [
      "Preprocess 250,000+ credit card transactions with extreme class imbalance.",
      "Apply SMOTE over-sampling strictly on the training partition.",
      "Train Random Forest and XGBoost classifiers; evaluate using Recall and ROC-AUC.",
      "Deploy risk scoring endpoint with low latency."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "What challenge does the Fraud Detection System solve for financial institutions?",
        "options": [
          "Detecting rare fraudulent credit card transactions from high-volume imbalanced payment streams",
          "Converting credit card numbers into barcode images",
          "Sending paper bank statements via postal mail",
          "Calculating interest rates for mortgage loans"
        ],
        "correctIndex": 0,
        "explanation": "The system detects rare fraudulent anomalies buried in high-volume payment streams."
      },
      {
        "id": "q2",
        "section": "Section 2 — Technologies Selected",
        "question": "Why is XGBoost effective for imbalanced fraud datasets?",
        "options": [
          "XGBoost captures complex non-linear feature interactions and supports gradient-boosted sample weighting",
          "XGBoost runs without any training data",
          "XGBoost only works on text files",
          "XGBoost deletes imbalanced rows automatically"
        ],
        "correctIndex": 0,
        "explanation": "Gradient boosted decision trees handle non-linear relationships and weighted imbalanced samples."
      }
    ]
  },
  {
    "id": 4,
    "slug": "recommendation-engine",
    "name": "Recommendation Engine",
    "course": "Data Science",
    "course_slug": "data-science",
    "project_order": 2,
    "skills": [
      "Collaborative Filtering",
      "Matrix Factorization",
      "Cosine Similarity",
      "Content Search"
    ],
    "difficulty": "Intermediate",
    "description": "Personalized content and product recommendation engine leveraging hybrid filtering techniques.",
    "problem_statement": "Build a personalized product recommendation engine to increase customer catalog discovery and engagement.",
    "real_world_use_case": "Powers personalized 'Recommended for You' widgets on e-commerce and streaming media platforms.",
    "required_modules": [
      "✓ Collaborative Filtering",
      "✓ Matrix Factorization (SVD)",
      "✓ Cosine Similarity",
      "✓ Content Search"
    ],
    "technologies": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Surprise"
    ],
    "build_requirements": [
      "Build a user-item rating matrix from 100,000+ user interactions.",
      "Implement Content-Based Filtering using TF-IDF and Cosine Similarity.",
      "Implement Collaborative Filtering using Singular Value Decomposition (SVD).",
      "Combine both models into a hybrid recommendation pipeline."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "What is the 'Cold Start Problem' in recommendation systems?",
        "options": [
          "The challenge of making accurate recommendations for new users or items with zero historical interaction data",
          "The computer server freezing up in winter",
          "When a user logs out of their account",
          "A database error caused by low disk space"
        ],
        "correctIndex": 0,
        "explanation": "Collaborative filtering relies on history; new items/users require fallback content-based logic."
      }
    ]
  },
  {
    "id": 5,
    "slug": "ai-resume-screening-agent",
    "name": "AI Resume Screening Agent",
    "course": "AI / ML Engineer",
    "course_slug": "ai-ml-engineer",
    "project_order": 1,
    "skills": [
      "PyTorch Neural Networks",
      "Text Extraction",
      "Deep Learning NLP",
      "FastAPI Serving"
    ],
    "difficulty": "Advanced",
    "description": "Automated HR recruiting system that parses candidate resumes, evaluates technical fit scores, and conducts initial screenings.",
    "problem_statement": "Automate HR resume parsing and candidate experience scoring against technical job descriptions using deep learning models.",
    "real_world_use_case": "Speeds up recruiter workflows by auto-evaluating candidate fit and generating tailored technical interview questions.",
    "required_modules": [
      "✓ PyTorch Neural Networks",
      "✓ Text Extraction",
      "✓ Deep Learning NLP",
      "✓ Model Evaluation",
      "✓ FastAPI Serving"
    ],
    "technologies": [
      "PyTorch",
      "Scikit-Learn",
      "FastAPI",
      "Pydantic",
      "Python"
    ],
    "build_requirements": [
      "Extract unstructured text from candidate PDF/Word resumes.",
      "Enforce structured JSON output extraction using Pydantic schemas (Skills, Experience Years, Education).",
      "Build a PyTorch neural network evaluation model to score candidates against job requirements.",
      "Serve inference endpoints with FastAPI."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "How does the AI Resume Screening Agent streamline HR recruiting?",
        "options": [
          "By parsing candidate resumes, scoring technical fit against job requirements, and generating screening summaries",
          "By sending rejection emails to all applicants automatically without reading",
          "By printing candidate resumes on paper",
          "By managing company payroll accounts"
        ],
        "correctIndex": 0,
        "explanation": "The agent parses resumes and scores candidate technical fit automatically."
      }
    ]
  },
  {
    "id": 6,
    "slug": "ai-sql-assistant",
    "name": "AI SQL Assistant",
    "course": "AI / ML Engineer",
    "course_slug": "ai-ml-engineer",
    "project_order": 2,
    "skills": [
      "Text-to-SQL Parsing",
      "Database Schema Introspection",
      "Execution Sandbox",
      "Streamlit UI"
    ],
    "difficulty": "Intermediate",
    "description": "Natural language interface that converts complex English business questions into optimized SQL queries.",
    "problem_statement": "Convert natural language business questions into valid, optimized SQL database queries.",
    "real_world_use_case": "Empowers non-technical business managers to query corporate SQL databases using plain English text.",
    "required_modules": [
      "✓ Text-to-SQL Parsing",
      "✓ Database Schema Introspection",
      "✓ Execution Sandbox",
      "✓ Streamlit UI"
    ],
    "technologies": [
      "Python",
      "PyTorch",
      "SQLAlchemy",
      "FastAPI",
      "Streamlit"
    ],
    "build_requirements": [
      "Introspect database schema definitions (Tables, Columns, Foreign Keys).",
      "Construct a schema-aware prompt instructing model to output executable SQL queries.",
      "Implement a execution sandbox to execute generated queries safely.",
      "Render visual data tables and charts using Streamlit."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "Why must generated SQL queries be validated before execution on production databases?",
        "options": [
          "To prevent SQL Injection vulnerabilities and dangerous destructive statements like DROP TABLE",
          "Because SQL queries expire after 5 minutes",
          "PyTorch only outputs pseudo-code",
          "Database servers reject model connections"
        ],
        "correctIndex": 0,
        "explanation": "Sanitization prevents accidental or malicious data modification from generated query code."
      }
    ]
  },
  {
    "id": 7,
    "slug": "enterprise-rag-chatbot",
    "name": "Enterprise RAG Chatbot",
    "course": "GenAI Engineer",
    "course_slug": "genai-engineer",
    "project_order": 1,
    "skills": [
      "Transformer Embeddings",
      "Vector Search (Pinecone)",
      "RAG Retrieval Chains",
      "Prompt Engineering"
    ],
    "difficulty": "Advanced",
    "description": "Enterprise knowledge assistant capable of querying thousands of PDF manuals with sub-second semantic retrieval.",
    "problem_statement": "Build an enterprise knowledge assistant that answers employee questions by querying internal PDF policy manuals and documents.",
    "real_world_use_case": "Eliminates manual PDF searching for compliance, technical, and HR teams by providing instant cited answers.",
    "required_modules": [
      "✓ Transformer Embeddings",
      "✓ Vector Search (Pinecone)",
      "✓ RAG Retrieval Chains",
      "✓ Prompt Engineering",
      "✓ Guardrails"
    ],
    "technologies": [
      "OpenAI API",
      "Gemini API",
      "Pinecone",
      "ChromaDB",
      "Tiktoken",
      "Streamlit"
    ],
    "build_requirements": [
      "Extract and chunk enterprise PDF documents using RecursiveCharacterTextSplitter.",
      "Generate dense vector embeddings using OpenAI `text-embedding-3-small`.",
      "Index vectors into Pinecone Vector Database with metadata filtering.",
      "Implement RAG retrieval chain with hallucination guardrails and source attribution."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "Why is Chunking Strategy critical when building Retrieval-Augmented Generation (RAG) systems?",
        "options": [
          "Proper chunk size preserves semantic context without overflowing LLM context window or diluting search relevance",
          "Chunking is only needed to reduce file sizes on disk",
          "LLMs cannot process text longer than 5 words",
          "Pinecone requires all text to be translated into French"
        ],
        "correctIndex": 0,
        "explanation": "Balanced chunking ensures retrieved passages contain complete answers while fitting model token limits."
      }
    ]
  },
  {
    "id": 8,
    "slug": "ai-customer-support-bot",
    "name": "AI Customer Support Bot",
    "course": "GenAI Engineer",
    "course_slug": "genai-engineer",
    "project_order": 2,
    "skills": [
      "Prompt Systems",
      "Tool Calling & Function Execution",
      "LLM Streaming",
      "FastAPI Serving"
    ],
    "difficulty": "Advanced",
    "description": "Self-correcting support agent integrated with refund APIs, order tracking systems, and escalation rules.",
    "problem_statement": "Build a self-correcting customer support chatbot integrated with order tracking APIs and refund tools.",
    "real_world_use_case": "Handles customer inquiries autonomously by executing order lookup and refund tool calls.",
    "required_modules": [
      "✓ Prompt Systems",
      "✓ Tool Calling & Function Execution",
      "✓ LLM Streaming",
      "✓ FastAPI Serving"
    ],
    "technologies": [
      "OpenAI API",
      "Claude API",
      "Ollama",
      "FastAPI",
      "Streamlit"
    ],
    "build_requirements": [
      "Define agent tools for `track_order()`, `process_refund()`, and `escalate_human()`.",
      "Implement conversation memory with LangChain Checkpoints.",
      "Build dynamic tool selection logic based on customer intent.",
      "Implement human-in-the-loop escalation triggers."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "What is Tool Calling in Generative AI systems?",
        "options": [
          "The ability of an LLM to decide when and how to invoke external APIs or database functions with generated parameters",
          "Calling customer service phone numbers automatically",
          "Downloading software updates from the web",
          "Translating Python code into Java"
        ],
        "correctIndex": 0,
        "explanation": "Tool calling allows LLMs to interact dynamically with external software APIs and databases."
      }
    ]
  },
  {
    "id": 9,
    "slug": "multi-agent-ai-workflow",
    "name": "Multi-Agent AI Workflow",
    "course": "Agentic AI Engineer",
    "course_slug": "agentic-ai-engineer",
    "project_order": 1,
    "skills": [
      "LangGraph State Graphs",
      "Multi-Agent Orchestration",
      "Tool Calling",
      "Human-in-the-Loop",
      "MCP Protocol"
    ],
    "difficulty": "Advanced",
    "description": "Collab-driven agentic team where researcher, coder, and reviewer agents autonomously complete software features.",
    "problem_statement": "Architect a multi-agent AI team (Researcher, Coder, Reviewer) that autonomously collaborates to write, review, and debug software.",
    "real_world_use_case": "Automates software development workflows, code reviews, and bug fixing through stateful agent loops.",
    "required_modules": [
      "✓ LangGraph State Graphs",
      "✓ Multi-Agent Orchestration",
      "✓ Tool Calling",
      "✓ Human-in-the-Loop",
      "✓ MCP Protocol"
    ],
    "technologies": [
      "LangChain",
      "LangGraph",
      "MCP Protocol",
      "Claude API",
      "FastAPI"
    ],
    "build_requirements": [
      "Architect a stateful multi-agent workflow using LangGraph state graph nodes.",
      "Define specialized roles: Researcher, Coder, and Code Reviewer.",
      "Implement conditional edge routing: if Code Reviewer finds bugs, loop back to Coder node.",
      "Integrate Model Context Protocol (MCP) for shared context storage."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "How do Conditional Edges function in a LangGraph multi-agent architecture?",
        "options": [
          "They route workflow execution dynamically based on the state output of the previous agent node",
          "They permanently terminate the application",
          "They draw graphics on screen",
          "They delete temporary files on exit"
        ],
        "correctIndex": 0,
        "explanation": "Conditional edges evaluate state values to decide which agent node executes next in the graph."
      }
    ]
  },
  {
    "id": 10,
    "slug": "voice-ai-assistant",
    "name": "Voice AI Assistant",
    "course": "Agentic AI Engineer",
    "course_slug": "agentic-ai-engineer",
    "project_order": 2,
    "skills": [
      "Speech-to-Text (Whisper)",
      "Agentic Reasoning",
      "Audio Synthesis (ElevenLabs)",
      "Real-Time Streaming"
    ],
    "difficulty": "Advanced",
    "description": "Real-time conversational voice agent handling speech recognition, LLM reasoning, tool calling, and speech synthesis.",
    "problem_statement": "Build a real-time conversational voice agent handling speech recognition, LLM reasoning, tool calling, and speech synthesis.",
    "real_world_use_case": "Provides hands-on voice interface for field engineers, medical transcription, and automated phone assistants.",
    "required_modules": [
      "✓ Speech-to-Text (Whisper)",
      "✓ Agentic Reasoning",
      "✓ Audio Synthesis (ElevenLabs)",
      "✓ Real-Time Streaming"
    ],
    "technologies": [
      "Whisper API",
      "LangChain",
      "ElevenLabs API",
      "FastAPI"
    ],
    "build_requirements": [
      "Stream audio input and transcribe speech using OpenAI Whisper API.",
      "Pass transcribed query to LLM with streaming response output.",
      "Synthesize real-time audio output using ElevenLabs API.",
      "Achieve sub-800ms end-to-end voice latency."
    ],
    "assessment_questions": [
      {
        "id": "q1",
        "section": "Section 1 — Problem Solved",
        "question": "Why is Streaming essential in conversational Voice AI pipelines?",
        "options": [
          "It streams generated tokens directly to text-to-speech engines immediately, minimizing perceived response delay",
          "Streaming is only needed to play background music",
          "Voice AI cannot work without satellite internet",
          "To reduce computer speaker volume"
        ],
        "correctIndex": 0,
        "explanation": "Streaming token outputs directly to audio synthesis reduces latency, enabling natural real-time dialogue."
      }
    ]
  }
];

export const INCLUDED_FEATURES = [
  { icon: "🎥", title: "Live Virtual Classes", desc: "Interactive weekend live workshops with industry experts and Q&A sessions." },
  { icon: "📼", title: "Recorded Sessions", desc: "Lifetime access to all HD video lectures, code notebooks, and lesson slides." },
  { icon: "🛠️", title: "Hands-On Projects", desc: "10 real-world industry portfolio projects evaluated by senior engineers." },
  { icon: "📄", title: "Resume Building", desc: "ATS-formatted resume review to highlight your technical skills and projects." },
  { icon: "💼", title: "LinkedIn Optimization", desc: "Professional profile branding strategy to attract top recruiter outreach." },
  { icon: "🐙", title: "GitHub Portfolio", desc: "Build a clean, documented GitHub repository structure for hiring teams." },
  { icon: "🗣️", title: "Mock Interviews", desc: "1-on-1 technical and behavioral mock interview practice sessions." },
  { icon: "👔", title: "HR Interview Prep", desc: "Guidance on salary negotiation, career transitions, and culture fit." },
  { icon: "💻", title: "Technical Interview Prep", desc: "Deep dives into live coding, SQL challenges, and system design questions." },
  { icon: "📊", title: "Case Study Discussions", desc: "Analyze real enterprise business problems solved by Data Science teams." },
  { icon: "🏢", title: "Real Business Scenarios", desc: "Practice with noisy, messy, real-world data pipelines." },
  { icon: "💬", title: "Corporate Communication", desc: "Master business storytelling and presenting technical insights to executives." }
];

export const FAQ_ITEMS = [
  {
    q: "Do I need prior coding experience to join?",
    a: "No! Stage 1 starts from total scratch with Python Fundamentals, basic programming logic, math essentials, and database concepts before moving into advanced topics."
  },
  {
    q: "How does enrollment, payment verification, and course access work?",
    a: "The enrollment process is simple and straightforward 😊: 1. Complete your course payment via UPI. 2. Submit your payment details/UTR and screenshot for manual verification. 3. Once verified, your enrollment is confirmed. 4. You receive access to the private course portal and/or private YouTube content. 5. Class links and recordings will be shared regularly for viewing during your access period. Please keep your course access details private and do not share them with others."
  },
  {
    q: "Are the courses self-paced or scheduled?",
    a: "You get instant access to recorded video modules so you can learn at your own pace, alongside live weekend Q&A and project review sessions."
  },
  {
    q: "Will I receive a verified certificate upon completion?",
    a: "Yes! Once you complete 100% of your course lessons, submit your project, and pass the project knowledge assessment, a shareable digital EdTech Certificate with a unique verification ID is issued."
  },
  {
    q: "What if I get stuck on a coding assignment?",
    a: "You have 24/7 access to our student community support channels and direct mentor assistance via WhatsApp and Q&A forums."
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Master Excel, SQL, Python, Pandas, Matplotlib, Power BI, and Exploratory Data Analysis to drive strategic business decisions.",
    category: "Data",
    price: 1999,
    original_price: 5999,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    instructor_name: "Shaik Anwar",
    instructor_role: "Senior Data Scientist",
    difficulty: "Beginner",
    duration: "40 Hours",
    published: true,
    modules_count: 10,
    projects_count: 2,
    technologies: ["Excel", "SQL", "Python", "Pandas", "Matplotlib", "Power BI"],
    outcomes: [
      "Master Excel VLOOKUP, XLOOKUP, Pivot Tables, and business reporting",
      "Query PostgreSQL databases using SQL Joins, Window Functions, and CTEs",
      "Perform Exploratory Data Analysis (EDA) in Python Pandas",
      "Build dynamic executive dashboards in Power BI with DAX measures",
      "Solve 10+ real retail and financial analytics business case studies",
      "Build a professional GitHub portfolio with documented SQL & Python projects"
    ],
    prerequisites: ["Basic computer literacy", "No prior coding needed"],
    target_audience: ["Aspiring Data Analysts", "Business Professionals", "Recent Graduates"],
    modules: [
    {
        "id": "course-1-mod-1",
        "course_id": "course-1",
        "title": "Module 1: Computational Foundation & Python Programming Logic",
        "description": "Comprehensive module covering Module 1: Computational Foundation & Python Programming Logic with real datasets and practical programming tasks.",
        "order": 1,
        "lessons": [
            {
                "id": "course-1-mod-1-les-1",
                "module_id": "course-1-mod-1",
                "course_id": "course-1",
                "title": "Lesson 1.1: Fundamentals & Conceptual Overview of Computational Foundation & Python Programming Logic",
                "description": "Practical hands-on walkthrough for lesson 1.1: fundamentals & conceptual overview of computational foundation & python programming logic with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": true
            },
            {
                "id": "course-1-mod-1-les-2",
                "module_id": "course-1-mod-1",
                "course_id": "course-1",
                "title": "Lesson 1.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 1.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-1-les-3",
                "module_id": "course-1-mod-1",
                "course_id": "course-1",
                "title": "Lesson 1.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 1.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-1-les-4",
                "module_id": "course-1-mod-1",
                "course_id": "course-1",
                "title": "Lesson 1.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 1.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-2",
        "course_id": "course-1",
        "title": "Module 2: Advanced Python Syntax, OOP & Modular Structure",
        "description": "Comprehensive module covering Module 2: Advanced Python Syntax, OOP & Modular Structure with real datasets and practical programming tasks.",
        "order": 2,
        "lessons": [
            {
                "id": "course-1-mod-2-les-1",
                "module_id": "course-1-mod-2",
                "course_id": "course-1",
                "title": "Lesson 2.1: Fundamentals & Conceptual Overview of Advanced Python Syntax, OOP & Modular Structure",
                "description": "Practical hands-on walkthrough for lesson 2.1: fundamentals & conceptual overview of advanced python syntax, oop & modular structure with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-2-les-2",
                "module_id": "course-1-mod-2",
                "course_id": "course-1",
                "title": "Lesson 2.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 2.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-2-les-3",
                "module_id": "course-1-mod-2",
                "course_id": "course-1",
                "title": "Lesson 2.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 2.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-2-les-4",
                "module_id": "course-1-mod-2",
                "course_id": "course-1",
                "title": "Lesson 2.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 2.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-3",
        "course_id": "course-1",
        "title": "Module 3: Relational Database Querying & SQL Fundamentals",
        "description": "Comprehensive module covering Module 3: Relational Database Querying & SQL Fundamentals with real datasets and practical programming tasks.",
        "order": 3,
        "lessons": [
            {
                "id": "course-1-mod-3-les-1",
                "module_id": "course-1-mod-3",
                "course_id": "course-1",
                "title": "Lesson 3.1: Fundamentals & Conceptual Overview of Relational Database Querying & SQL Fundamentals",
                "description": "Practical hands-on walkthrough for lesson 3.1: fundamentals & conceptual overview of relational database querying & sql fundamentals with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-3-les-2",
                "module_id": "course-1-mod-3",
                "course_id": "course-1",
                "title": "Lesson 3.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 3.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-3-les-3",
                "module_id": "course-1-mod-3",
                "course_id": "course-1",
                "title": "Lesson 3.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 3.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-3-les-4",
                "module_id": "course-1-mod-3",
                "course_id": "course-1",
                "title": "Lesson 3.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 3.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-4",
        "course_id": "course-1",
        "title": "Module 4: Advanced SQL — Joins, Subqueries, CTEs & Window Functions",
        "description": "Comprehensive module covering Module 4: Advanced SQL — Joins, Subqueries, CTEs & Window Functions with real datasets and practical programming tasks.",
        "order": 4,
        "lessons": [
            {
                "id": "course-1-mod-4-les-1",
                "module_id": "course-1-mod-4",
                "course_id": "course-1",
                "title": "Lesson 4.1: Fundamentals & Conceptual Overview of Advanced SQL — Joins, Subqueries, CTEs & Window Functions",
                "description": "Practical hands-on walkthrough for lesson 4.1: fundamentals & conceptual overview of advanced sql — joins, subqueries, ctes & window functions with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-4-les-2",
                "module_id": "course-1-mod-4",
                "course_id": "course-1",
                "title": "Lesson 4.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 4.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-4-les-3",
                "module_id": "course-1-mod-4",
                "course_id": "course-1",
                "title": "Lesson 4.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 4.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-4-les-4",
                "module_id": "course-1-mod-4",
                "course_id": "course-1",
                "title": "Lesson 4.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 4.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-5",
        "course_id": "course-1",
        "title": "Module 5: Mathematical Foundations & Descriptive Statistics",
        "description": "Comprehensive module covering Module 5: Mathematical Foundations & Descriptive Statistics with real datasets and practical programming tasks.",
        "order": 5,
        "lessons": [
            {
                "id": "course-1-mod-5-les-1",
                "module_id": "course-1-mod-5",
                "course_id": "course-1",
                "title": "Lesson 5.1: Fundamentals & Conceptual Overview of Mathematical Foundations & Descriptive Statistics",
                "description": "Practical hands-on walkthrough for lesson 5.1: fundamentals & conceptual overview of mathematical foundations & descriptive statistics with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-5-les-2",
                "module_id": "course-1-mod-5",
                "course_id": "course-1",
                "title": "Lesson 5.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 5.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-5-les-3",
                "module_id": "course-1-mod-5",
                "course_id": "course-1",
                "title": "Lesson 5.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 5.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-5-les-4",
                "module_id": "course-1-mod-5",
                "course_id": "course-1",
                "title": "Lesson 5.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 5.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-6",
        "course_id": "course-1",
        "title": "Module 6: Excel Business Reporting & Data Modeling",
        "description": "Comprehensive module covering Module 6: Excel Business Reporting & Data Modeling with real datasets and practical programming tasks.",
        "order": 6,
        "lessons": [
            {
                "id": "course-1-mod-6-les-1",
                "module_id": "course-1-mod-6",
                "course_id": "course-1",
                "title": "Lesson 6.1: Fundamentals & Conceptual Overview of Excel Business Reporting & Data Modeling",
                "description": "Practical hands-on walkthrough for lesson 6.1: fundamentals & conceptual overview of excel business reporting & data modeling with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-6-les-2",
                "module_id": "course-1-mod-6",
                "course_id": "course-1",
                "title": "Lesson 6.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 6.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-6-les-3",
                "module_id": "course-1-mod-6",
                "course_id": "course-1",
                "title": "Lesson 6.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 6.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-6-les-4",
                "module_id": "course-1-mod-6",
                "course_id": "course-1",
                "title": "Lesson 6.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 6.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-7",
        "course_id": "course-1",
        "title": "Module 7: Numerical Computing with NumPy & Pandas Dataframes",
        "description": "Comprehensive module covering Module 7: Numerical Computing with NumPy & Pandas Dataframes with real datasets and practical programming tasks.",
        "order": 7,
        "lessons": [
            {
                "id": "course-1-mod-7-les-1",
                "module_id": "course-1-mod-7",
                "course_id": "course-1",
                "title": "Lesson 7.1: Fundamentals & Conceptual Overview of Numerical Computing with NumPy & Pandas Dataframes",
                "description": "Practical hands-on walkthrough for lesson 7.1: fundamentals & conceptual overview of numerical computing with numpy & pandas dataframes with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-7-les-2",
                "module_id": "course-1-mod-7",
                "course_id": "course-1",
                "title": "Lesson 7.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 7.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-7-les-3",
                "module_id": "course-1-mod-7",
                "course_id": "course-1",
                "title": "Lesson 7.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 7.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-7-les-4",
                "module_id": "course-1-mod-7",
                "course_id": "course-1",
                "title": "Lesson 7.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 7.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-8",
        "course_id": "course-1",
        "title": "Module 8: Exploratory Data Analysis (EDA) & Data Cleaning",
        "description": "Comprehensive module covering Module 8: Exploratory Data Analysis (EDA) & Data Cleaning with real datasets and practical programming tasks.",
        "order": 8,
        "lessons": [
            {
                "id": "course-1-mod-8-les-1",
                "module_id": "course-1-mod-8",
                "course_id": "course-1",
                "title": "Lesson 8.1: Fundamentals & Conceptual Overview of Exploratory Data Analysis (EDA) & Data Cleaning",
                "description": "Practical hands-on walkthrough for lesson 8.1: fundamentals & conceptual overview of exploratory data analysis (eda) & data cleaning with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-8-les-2",
                "module_id": "course-1-mod-8",
                "course_id": "course-1",
                "title": "Lesson 8.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 8.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-8-les-3",
                "module_id": "course-1-mod-8",
                "course_id": "course-1",
                "title": "Lesson 8.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 8.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-8-les-4",
                "module_id": "course-1-mod-8",
                "course_id": "course-1",
                "title": "Lesson 8.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 8.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-9",
        "course_id": "course-1",
        "title": "Module 9: Business Data Visualization with Matplotlib & Seaborn",
        "description": "Comprehensive module covering Module 9: Business Data Visualization with Matplotlib & Seaborn with real datasets and practical programming tasks.",
        "order": 9,
        "lessons": [
            {
                "id": "course-1-mod-9-les-1",
                "module_id": "course-1-mod-9",
                "course_id": "course-1",
                "title": "Lesson 9.1: Fundamentals & Conceptual Overview of Business Data Visualization with Matplotlib & Seaborn",
                "description": "Practical hands-on walkthrough for lesson 9.1: fundamentals & conceptual overview of business data visualization with matplotlib & seaborn with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-9-les-2",
                "module_id": "course-1-mod-9",
                "course_id": "course-1",
                "title": "Lesson 9.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 9.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-9-les-3",
                "module_id": "course-1-mod-9",
                "course_id": "course-1",
                "title": "Lesson 9.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 9.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-9-les-4",
                "module_id": "course-1-mod-9",
                "course_id": "course-1",
                "title": "Lesson 9.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 9.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-1-mod-10",
        "course_id": "course-1",
        "title": "Module 10: Executive Dashboards & Power BI Analytics",
        "description": "Comprehensive module covering Module 10: Executive Dashboards & Power BI Analytics with real datasets and practical programming tasks.",
        "order": 10,
        "lessons": [
            {
                "id": "course-1-mod-10-les-1",
                "module_id": "course-1-mod-10",
                "course_id": "course-1",
                "title": "Lesson 10.1: Fundamentals & Conceptual Overview of Executive Dashboards & Power BI Analytics",
                "description": "Practical hands-on walkthrough for lesson 10.1: fundamentals & conceptual overview of executive dashboards & power bi analytics with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-1-mod-10-les-2",
                "module_id": "course-1-mod-10",
                "course_id": "course-1",
                "title": "Lesson 10.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 10.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-1-mod-10-les-3",
                "module_id": "course-1-mod-10",
                "course_id": "course-1",
                "title": "Lesson 10.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 10.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-1-mod-10-les-4",
                "module_id": "course-1-mod-10",
                "course_id": "course-1",
                "title": "Lesson 10.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 10.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    }
]
  },
  {
    id: "course-2",
    slug: "data-science",
    title: "Data Science",
    description: "Comprehensive pathway covering Advanced Python, Statistics, Machine Learning Algorithms, Feature Engineering, and Predictive Analytics.",
    category: "Data",
    price: 2499,
    original_price: 7999,
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
    instructor_name: "Shaik Anwar",
    instructor_role: "Senior Data Scientist",
    difficulty: "Intermediate",
    duration: "65 Hours",
    published: true,
    modules_count: 10,
    projects_count: 2,
    technologies: ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "XGBoost", "Seaborn"],
    outcomes: [
      "Build predictive classification and regression models in Scikit-Learn",
      "Perform advanced feature engineering and hyperparameter tuning",
      "Handle imbalanced datasets using SMOTE and cross-validation pipelines",
      "Develop recommendation engines and customer churn predictors",
      "Apply hypothesis testing, probability distributions, and A/B testing",
      "Deploy ML predictive pipelines into automated cloud environments"
    ],
    prerequisites: ["Basic Python syntax", "Fundamentals of high school math"],
    target_audience: ["Data Analysts seeking promotion", "Software Developers", "STEM Students"],
    modules: [
    {
        "id": "course-2-mod-1",
        "course_id": "course-2",
        "title": "Module 1: Advanced Exploratory Data Analysis & Feature Extraction",
        "description": "Comprehensive module covering Module 1: Advanced Exploratory Data Analysis & Feature Extraction with real datasets and practical programming tasks.",
        "order": 1,
        "lessons": [
            {
                "id": "course-2-mod-1-les-1",
                "module_id": "course-2-mod-1",
                "course_id": "course-2",
                "title": "Lesson 1.1: Fundamentals & Conceptual Overview of Advanced Exploratory Data Analysis & Feature Extraction",
                "description": "Practical hands-on walkthrough for lesson 1.1: fundamentals & conceptual overview of advanced exploratory data analysis & feature extraction with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": true
            },
            {
                "id": "course-2-mod-1-les-2",
                "module_id": "course-2-mod-1",
                "course_id": "course-2",
                "title": "Lesson 1.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 1.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-1-les-3",
                "module_id": "course-2-mod-1",
                "course_id": "course-2",
                "title": "Lesson 1.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 1.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-1-les-4",
                "module_id": "course-2-mod-1",
                "course_id": "course-2",
                "title": "Lesson 1.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 1.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-2",
        "course_id": "course-2",
        "title": "Module 2: Probability Distributions & Inferential Statistics",
        "description": "Comprehensive module covering Module 2: Probability Distributions & Inferential Statistics with real datasets and practical programming tasks.",
        "order": 2,
        "lessons": [
            {
                "id": "course-2-mod-2-les-1",
                "module_id": "course-2-mod-2",
                "course_id": "course-2",
                "title": "Lesson 2.1: Fundamentals & Conceptual Overview of Probability Distributions & Inferential Statistics",
                "description": "Practical hands-on walkthrough for lesson 2.1: fundamentals & conceptual overview of probability distributions & inferential statistics with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-2-les-2",
                "module_id": "course-2-mod-2",
                "course_id": "course-2",
                "title": "Lesson 2.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 2.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-2-les-3",
                "module_id": "course-2-mod-2",
                "course_id": "course-2",
                "title": "Lesson 2.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 2.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-2-les-4",
                "module_id": "course-2-mod-2",
                "course_id": "course-2",
                "title": "Lesson 2.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 2.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-3",
        "course_id": "course-2",
        "title": "Module 3: Hypothesis Testing, A/B Testing & Confidence Intervals",
        "description": "Comprehensive module covering Module 3: Hypothesis Testing, A/B Testing & Confidence Intervals with real datasets and practical programming tasks.",
        "order": 3,
        "lessons": [
            {
                "id": "course-2-mod-3-les-1",
                "module_id": "course-2-mod-3",
                "course_id": "course-2",
                "title": "Lesson 3.1: Fundamentals & Conceptual Overview of Hypothesis Testing, A/B Testing & Confidence Intervals",
                "description": "Practical hands-on walkthrough for lesson 3.1: fundamentals & conceptual overview of hypothesis testing, a/b testing & confidence intervals with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-3-les-2",
                "module_id": "course-2-mod-3",
                "course_id": "course-2",
                "title": "Lesson 3.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 3.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-3-les-3",
                "module_id": "course-2-mod-3",
                "course_id": "course-2",
                "title": "Lesson 3.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 3.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-3-les-4",
                "module_id": "course-2-mod-3",
                "course_id": "course-2",
                "title": "Lesson 3.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 3.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-4",
        "course_id": "course-2",
        "title": "Module 4: Machine Learning Fundamentals & Supervised Workflows",
        "description": "Comprehensive module covering Module 4: Machine Learning Fundamentals & Supervised Workflows with real datasets and practical programming tasks.",
        "order": 4,
        "lessons": [
            {
                "id": "course-2-mod-4-les-1",
                "module_id": "course-2-mod-4",
                "course_id": "course-2",
                "title": "Lesson 4.1: Fundamentals & Conceptual Overview of Machine Learning Fundamentals & Supervised Workflows",
                "description": "Practical hands-on walkthrough for lesson 4.1: fundamentals & conceptual overview of machine learning fundamentals & supervised workflows with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-4-les-2",
                "module_id": "course-2-mod-4",
                "course_id": "course-2",
                "title": "Lesson 4.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 4.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-4-les-3",
                "module_id": "course-2-mod-4",
                "course_id": "course-2",
                "title": "Lesson 4.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 4.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-4-les-4",
                "module_id": "course-2-mod-4",
                "course_id": "course-2",
                "title": "Lesson 4.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 4.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-5",
        "course_id": "course-2",
        "title": "Module 5: Regression Analysis (Linear, Ridge, Lasso)",
        "description": "Comprehensive module covering Module 5: Regression Analysis (Linear, Ridge, Lasso) with real datasets and practical programming tasks.",
        "order": 5,
        "lessons": [
            {
                "id": "course-2-mod-5-les-1",
                "module_id": "course-2-mod-5",
                "course_id": "course-2",
                "title": "Lesson 5.1: Fundamentals & Conceptual Overview of Regression Analysis (Linear, Ridge, Lasso)",
                "description": "Practical hands-on walkthrough for lesson 5.1: fundamentals & conceptual overview of regression analysis (linear, ridge, lasso) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-5-les-2",
                "module_id": "course-2-mod-5",
                "course_id": "course-2",
                "title": "Lesson 5.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 5.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-5-les-3",
                "module_id": "course-2-mod-5",
                "course_id": "course-2",
                "title": "Lesson 5.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 5.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-5-les-4",
                "module_id": "course-2-mod-5",
                "course_id": "course-2",
                "title": "Lesson 5.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 5.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-6",
        "course_id": "course-2",
        "title": "Module 6: Classification Models (Logistic, KNN, Naive Bayes)",
        "description": "Comprehensive module covering Module 6: Classification Models (Logistic, KNN, Naive Bayes) with real datasets and practical programming tasks.",
        "order": 6,
        "lessons": [
            {
                "id": "course-2-mod-6-les-1",
                "module_id": "course-2-mod-6",
                "course_id": "course-2",
                "title": "Lesson 6.1: Fundamentals & Conceptual Overview of Classification Models (Logistic, KNN, Naive Bayes)",
                "description": "Practical hands-on walkthrough for lesson 6.1: fundamentals & conceptual overview of classification models (logistic, knn, naive bayes) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-6-les-2",
                "module_id": "course-2-mod-6",
                "course_id": "course-2",
                "title": "Lesson 6.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 6.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-6-les-3",
                "module_id": "course-2-mod-6",
                "course_id": "course-2",
                "title": "Lesson 6.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 6.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-6-les-4",
                "module_id": "course-2-mod-6",
                "course_id": "course-2",
                "title": "Lesson 6.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 6.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-7",
        "course_id": "course-2",
        "title": "Module 7: Decision Trees, Random Forests & Ensemble Learning",
        "description": "Comprehensive module covering Module 7: Decision Trees, Random Forests & Ensemble Learning with real datasets and practical programming tasks.",
        "order": 7,
        "lessons": [
            {
                "id": "course-2-mod-7-les-1",
                "module_id": "course-2-mod-7",
                "course_id": "course-2",
                "title": "Lesson 7.1: Fundamentals & Conceptual Overview of Decision Trees, Random Forests & Ensemble Learning",
                "description": "Practical hands-on walkthrough for lesson 7.1: fundamentals & conceptual overview of decision trees, random forests & ensemble learning with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-7-les-2",
                "module_id": "course-2-mod-7",
                "course_id": "course-2",
                "title": "Lesson 7.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 7.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-7-les-3",
                "module_id": "course-2-mod-7",
                "course_id": "course-2",
                "title": "Lesson 7.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 7.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-7-les-4",
                "module_id": "course-2-mod-7",
                "course_id": "course-2",
                "title": "Lesson 7.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 7.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-8",
        "course_id": "course-2",
        "title": "Module 8: Unsupervised Learning — Clustering (K-Means, DBSCAN)",
        "description": "Comprehensive module covering Module 8: Unsupervised Learning — Clustering (K-Means, DBSCAN) with real datasets and practical programming tasks.",
        "order": 8,
        "lessons": [
            {
                "id": "course-2-mod-8-les-1",
                "module_id": "course-2-mod-8",
                "course_id": "course-2",
                "title": "Lesson 8.1: Fundamentals & Conceptual Overview of Unsupervised Learning — Clustering (K-Means, DBSCAN)",
                "description": "Practical hands-on walkthrough for lesson 8.1: fundamentals & conceptual overview of unsupervised learning — clustering (k-means, dbscan) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-8-les-2",
                "module_id": "course-2-mod-8",
                "course_id": "course-2",
                "title": "Lesson 8.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 8.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-8-les-3",
                "module_id": "course-2-mod-8",
                "course_id": "course-2",
                "title": "Lesson 8.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 8.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-8-les-4",
                "module_id": "course-2-mod-8",
                "course_id": "course-2",
                "title": "Lesson 8.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 8.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-9",
        "course_id": "course-2",
        "title": "Module 9: Dimensionality Reduction (PCA, t-SNE) & Recommendation Systems",
        "description": "Comprehensive module covering Module 9: Dimensionality Reduction (PCA, t-SNE) & Recommendation Systems with real datasets and practical programming tasks.",
        "order": 9,
        "lessons": [
            {
                "id": "course-2-mod-9-les-1",
                "module_id": "course-2-mod-9",
                "course_id": "course-2",
                "title": "Lesson 9.1: Fundamentals & Conceptual Overview of Dimensionality Reduction (PCA, t-SNE) & Recommendation Systems",
                "description": "Practical hands-on walkthrough for lesson 9.1: fundamentals & conceptual overview of dimensionality reduction (pca, t-sne) & recommendation systems with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-9-les-2",
                "module_id": "course-2-mod-9",
                "course_id": "course-2",
                "title": "Lesson 9.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 9.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-9-les-3",
                "module_id": "course-2-mod-9",
                "course_id": "course-2",
                "title": "Lesson 9.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 9.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-9-les-4",
                "module_id": "course-2-mod-9",
                "course_id": "course-2",
                "title": "Lesson 9.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 9.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-2-mod-10",
        "course_id": "course-2",
        "title": "Module 10: Model Evaluation, Cross-Validation & SMOTE Class Imbalance",
        "description": "Comprehensive module covering Module 10: Model Evaluation, Cross-Validation & SMOTE Class Imbalance with real datasets and practical programming tasks.",
        "order": 10,
        "lessons": [
            {
                "id": "course-2-mod-10-les-1",
                "module_id": "course-2-mod-10",
                "course_id": "course-2",
                "title": "Lesson 10.1: Fundamentals & Conceptual Overview of Model Evaluation, Cross-Validation & SMOTE Class Imbalance",
                "description": "Practical hands-on walkthrough for lesson 10.1: fundamentals & conceptual overview of model evaluation, cross-validation & smote class imbalance with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-2-mod-10-les-2",
                "module_id": "course-2-mod-10",
                "course_id": "course-2",
                "title": "Lesson 10.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 10.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-2-mod-10-les-3",
                "module_id": "course-2-mod-10",
                "course_id": "course-2",
                "title": "Lesson 10.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 10.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-2-mod-10-les-4",
                "module_id": "course-2-mod-10",
                "course_id": "course-2",
                "title": "Lesson 10.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 10.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    }
]
  },
  {
    id: "course-3",
    slug: "ai-ml-engineer",
    title: "AI / ML Engineer",
    description: "Deep dive into Linear Algebra, Optimization, Supervised & Unsupervised Learning, Neural Networks, PyTorch, and Hugging Face.",
    category: "AI & ML",
    price: 2999,
    original_price: 9999,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    instructor_name: "Shaik Anwar",
    instructor_role: "Senior Data Scientist",
    difficulty: "Intermediate",
    duration: "80 Hours",
    published: true,
    modules_count: 10,
    projects_count: 2,
    technologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV", "Hugging Face", "FastAPI"],
    outcomes: [
      "Architect deep neural networks (CNNs, RNNs, LSTMs) in PyTorch",
      "Implement unsupervised anomaly detection and autoencoders",
      "Deploy ML models into production endpoints with FastAPI",
      "Fine-tune pre-trained Vision and NLP transformers",
      "Optimize model inference using ONNX, TensorRT, and quantization",
      "Build real-time fraud detection and computer vision systems"
    ],
    prerequisites: ["Solid Python OOP knowledge", "Linear algebra & calculus fundamentals"],
    target_audience: ["Data Scientists", "Machine Learning Engineers", "Backend Developers"],
    modules: [
    {
        "id": "course-3-mod-1",
        "course_id": "course-3",
        "title": "Module 1: Advanced Machine Learning & XGBoost Optimization",
        "description": "Comprehensive module covering Module 1: Advanced Machine Learning & XGBoost Optimization with real datasets and practical programming tasks.",
        "order": 1,
        "lessons": [
            {
                "id": "course-3-mod-1-les-1",
                "module_id": "course-3-mod-1",
                "course_id": "course-3",
                "title": "Lesson 1.1: Fundamentals & Conceptual Overview of Advanced Machine Learning & XGBoost Optimization",
                "description": "Practical hands-on walkthrough for lesson 1.1: fundamentals & conceptual overview of advanced machine learning & xgboost optimization with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": true
            },
            {
                "id": "course-3-mod-1-les-2",
                "module_id": "course-3-mod-1",
                "course_id": "course-3",
                "title": "Lesson 1.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 1.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-1-les-3",
                "module_id": "course-3-mod-1",
                "course_id": "course-3",
                "title": "Lesson 1.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 1.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-1-les-4",
                "module_id": "course-3-mod-1",
                "course_id": "course-3",
                "title": "Lesson 1.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 1.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-2",
        "course_id": "course-3",
        "title": "Module 2: Linear Algebra & Matrix Calculus for Deep Learning",
        "description": "Comprehensive module covering Module 2: Linear Algebra & Matrix Calculus for Deep Learning with real datasets and practical programming tasks.",
        "order": 2,
        "lessons": [
            {
                "id": "course-3-mod-2-les-1",
                "module_id": "course-3-mod-2",
                "course_id": "course-3",
                "title": "Lesson 2.1: Fundamentals & Conceptual Overview of Linear Algebra & Matrix Calculus for Deep Learning",
                "description": "Practical hands-on walkthrough for lesson 2.1: fundamentals & conceptual overview of linear algebra & matrix calculus for deep learning with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-2-les-2",
                "module_id": "course-3-mod-2",
                "course_id": "course-3",
                "title": "Lesson 2.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 2.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-2-les-3",
                "module_id": "course-3-mod-2",
                "course_id": "course-3",
                "title": "Lesson 2.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 2.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-2-les-4",
                "module_id": "course-3-mod-2",
                "course_id": "course-3",
                "title": "Lesson 2.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 2.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-3",
        "course_id": "course-3",
        "title": "Module 3: PyTorch Core Tensors, Gradients & Autograd Engine",
        "description": "Comprehensive module covering Module 3: PyTorch Core Tensors, Gradients & Autograd Engine with real datasets and practical programming tasks.",
        "order": 3,
        "lessons": [
            {
                "id": "course-3-mod-3-les-1",
                "module_id": "course-3-mod-3",
                "course_id": "course-3",
                "title": "Lesson 3.1: Fundamentals & Conceptual Overview of PyTorch Core Tensors, Gradients & Autograd Engine",
                "description": "Practical hands-on walkthrough for lesson 3.1: fundamentals & conceptual overview of pytorch core tensors, gradients & autograd engine with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-3-les-2",
                "module_id": "course-3-mod-3",
                "course_id": "course-3",
                "title": "Lesson 3.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 3.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-3-les-3",
                "module_id": "course-3-mod-3",
                "course_id": "course-3",
                "title": "Lesson 3.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 3.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-3-les-4",
                "module_id": "course-3-mod-3",
                "course_id": "course-3",
                "title": "Lesson 3.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 3.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-4",
        "course_id": "course-3",
        "title": "Module 4: Deep Neural Network Architecture & Backpropagation",
        "description": "Comprehensive module covering Module 4: Deep Neural Network Architecture & Backpropagation with real datasets and practical programming tasks.",
        "order": 4,
        "lessons": [
            {
                "id": "course-3-mod-4-les-1",
                "module_id": "course-3-mod-4",
                "course_id": "course-3",
                "title": "Lesson 4.1: Fundamentals & Conceptual Overview of Deep Neural Network Architecture & Backpropagation",
                "description": "Practical hands-on walkthrough for lesson 4.1: fundamentals & conceptual overview of deep neural network architecture & backpropagation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-4-les-2",
                "module_id": "course-3-mod-4",
                "course_id": "course-3",
                "title": "Lesson 4.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 4.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-4-les-3",
                "module_id": "course-3-mod-4",
                "course_id": "course-3",
                "title": "Lesson 4.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 4.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-4-les-4",
                "module_id": "course-3-mod-4",
                "course_id": "course-3",
                "title": "Lesson 4.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 4.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-5",
        "course_id": "course-3",
        "title": "Module 5: Convolutional Neural Networks (CNNs) & Image Processing",
        "description": "Comprehensive module covering Module 5: Convolutional Neural Networks (CNNs) & Image Processing with real datasets and practical programming tasks.",
        "order": 5,
        "lessons": [
            {
                "id": "course-3-mod-5-les-1",
                "module_id": "course-3-mod-5",
                "course_id": "course-3",
                "title": "Lesson 5.1: Fundamentals & Conceptual Overview of Convolutional Neural Networks (CNNs) & Image Processing",
                "description": "Practical hands-on walkthrough for lesson 5.1: fundamentals & conceptual overview of convolutional neural networks (cnns) & image processing with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-5-les-2",
                "module_id": "course-3-mod-5",
                "course_id": "course-3",
                "title": "Lesson 5.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 5.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-5-les-3",
                "module_id": "course-3-mod-5",
                "course_id": "course-3",
                "title": "Lesson 5.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 5.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-5-les-4",
                "module_id": "course-3-mod-5",
                "course_id": "course-3",
                "title": "Lesson 5.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 5.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-6",
        "course_id": "course-3",
        "title": "Module 6: Computer Vision & Transfer Learning (ResNet, EfficientNet)",
        "description": "Comprehensive module covering Module 6: Computer Vision & Transfer Learning (ResNet, EfficientNet) with real datasets and practical programming tasks.",
        "order": 6,
        "lessons": [
            {
                "id": "course-3-mod-6-les-1",
                "module_id": "course-3-mod-6",
                "course_id": "course-3",
                "title": "Lesson 6.1: Fundamentals & Conceptual Overview of Computer Vision & Transfer Learning (ResNet, EfficientNet)",
                "description": "Practical hands-on walkthrough for lesson 6.1: fundamentals & conceptual overview of computer vision & transfer learning (resnet, efficientnet) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-6-les-2",
                "module_id": "course-3-mod-6",
                "course_id": "course-3",
                "title": "Lesson 6.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 6.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-6-les-3",
                "module_id": "course-3-mod-6",
                "course_id": "course-3",
                "title": "Lesson 6.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 6.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-6-les-4",
                "module_id": "course-3-mod-6",
                "course_id": "course-3",
                "title": "Lesson 6.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 6.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-7",
        "course_id": "course-3",
        "title": "Module 7: Sequence Modeling & Recurrent Neural Networks (RNNs, LSTMs)",
        "description": "Comprehensive module covering Module 7: Sequence Modeling & Recurrent Neural Networks (RNNs, LSTMs) with real datasets and practical programming tasks.",
        "order": 7,
        "lessons": [
            {
                "id": "course-3-mod-7-les-1",
                "module_id": "course-3-mod-7",
                "course_id": "course-3",
                "title": "Lesson 7.1: Fundamentals & Conceptual Overview of Sequence Modeling & Recurrent Neural Networks (RNNs, LSTMs)",
                "description": "Practical hands-on walkthrough for lesson 7.1: fundamentals & conceptual overview of sequence modeling & recurrent neural networks (rnns, lstms) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-7-les-2",
                "module_id": "course-3-mod-7",
                "course_id": "course-3",
                "title": "Lesson 7.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 7.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-7-les-3",
                "module_id": "course-3-mod-7",
                "course_id": "course-3",
                "title": "Lesson 7.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 7.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-7-les-4",
                "module_id": "course-3-mod-7",
                "course_id": "course-3",
                "title": "Lesson 7.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 7.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-8",
        "course_id": "course-3",
        "title": "Module 8: Autoencoders & Unsupervised Anomaly Detection",
        "description": "Comprehensive module covering Module 8: Autoencoders & Unsupervised Anomaly Detection with real datasets and practical programming tasks.",
        "order": 8,
        "lessons": [
            {
                "id": "course-3-mod-8-les-1",
                "module_id": "course-3-mod-8",
                "course_id": "course-3",
                "title": "Lesson 8.1: Fundamentals & Conceptual Overview of Autoencoders & Unsupervised Anomaly Detection",
                "description": "Practical hands-on walkthrough for lesson 8.1: fundamentals & conceptual overview of autoencoders & unsupervised anomaly detection with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-8-les-2",
                "module_id": "course-3-mod-8",
                "course_id": "course-3",
                "title": "Lesson 8.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 8.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-8-les-3",
                "module_id": "course-3-mod-8",
                "course_id": "course-3",
                "title": "Lesson 8.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 8.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-8-les-4",
                "module_id": "course-3-mod-8",
                "course_id": "course-3",
                "title": "Lesson 8.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 8.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-9",
        "course_id": "course-3",
        "title": "Module 9: Model Optimization, Quantization & ONNX Export",
        "description": "Comprehensive module covering Module 9: Model Optimization, Quantization & ONNX Export with real datasets and practical programming tasks.",
        "order": 9,
        "lessons": [
            {
                "id": "course-3-mod-9-les-1",
                "module_id": "course-3-mod-9",
                "course_id": "course-3",
                "title": "Lesson 9.1: Fundamentals & Conceptual Overview of Model Optimization, Quantization & ONNX Export",
                "description": "Practical hands-on walkthrough for lesson 9.1: fundamentals & conceptual overview of model optimization, quantization & onnx export with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-9-les-2",
                "module_id": "course-3-mod-9",
                "course_id": "course-3",
                "title": "Lesson 9.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 9.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-9-les-3",
                "module_id": "course-3-mod-9",
                "course_id": "course-3",
                "title": "Lesson 9.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 9.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-9-les-4",
                "module_id": "course-3-mod-9",
                "course_id": "course-3",
                "title": "Lesson 9.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 9.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-3-mod-10",
        "course_id": "course-3",
        "title": "Module 10: Production Model Serving with FastAPI & Docker Containers",
        "description": "Comprehensive module covering Module 10: Production Model Serving with FastAPI & Docker Containers with real datasets and practical programming tasks.",
        "order": 10,
        "lessons": [
            {
                "id": "course-3-mod-10-les-1",
                "module_id": "course-3-mod-10",
                "course_id": "course-3",
                "title": "Lesson 10.1: Fundamentals & Conceptual Overview of Production Model Serving with FastAPI & Docker Containers",
                "description": "Practical hands-on walkthrough for lesson 10.1: fundamentals & conceptual overview of production model serving with fastapi & docker containers with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-3-mod-10-les-2",
                "module_id": "course-3-mod-10",
                "course_id": "course-3",
                "title": "Lesson 10.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 10.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-3-mod-10-les-3",
                "module_id": "course-3-mod-10",
                "course_id": "course-3",
                "title": "Lesson 10.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 10.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-3-mod-10-les-4",
                "module_id": "course-3-mod-10",
                "course_id": "course-3",
                "title": "Lesson 10.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 10.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    }
]
  },
  {
    id: "course-4",
    slug: "genai-engineer",
    title: "GenAI Engineer",
    description: "Build cutting-edge AI chatbots, Document Q&A systems, and Prompt Engineering workflows using OpenAI, Gemini, Claude, and Ollama.",
    category: "Generative AI",
    price: 3499,
    original_price: 11999,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    instructor_name: "Shaik Anwar",
    instructor_role: "Senior Data Scientist",
    difficulty: "Advanced",
    duration: "75 Hours",
    published: true,
    modules_count: 10,
    projects_count: 2,
    technologies: ["OpenAI API", "Gemini API", "Claude API", "Ollama", "vLLM", "Streamlit"],
    outcomes: [
      "Master Prompt Engineering techniques (Chain-of-Thought, Structured JSON)",
      "Build custom streaming AI assistants and Document Q&A tools",
      "Serve open-source LLMs locally with Ollama and vLLM",
      "Implement AI safety guardrails and evaluation benchmarks",
      "Fine-tune LLMs using LoRA, QLoRA, and HuggingFace PEFT",
      "Build enterprise-grade RAG knowledge systems with vector databases"
    ],
    prerequisites: ["Python API integration experience", "Stage 3 Machine Learning concepts"],
    target_audience: ["AI Developers", "Software Architects", "Tech Founders"],
    modules: [
    {
        "id": "course-4-mod-1",
        "course_id": "course-4",
        "title": "Module 1: Generative AI Fundamentals & Transformer Architecture",
        "description": "Comprehensive module covering Module 1: Generative AI Fundamentals & Transformer Architecture with real datasets and practical programming tasks.",
        "order": 1,
        "lessons": [
            {
                "id": "course-4-mod-1-les-1",
                "module_id": "course-4-mod-1",
                "course_id": "course-4",
                "title": "Lesson 1.1: Fundamentals & Conceptual Overview of Generative AI Fundamentals & Transformer Architecture",
                "description": "Practical hands-on walkthrough for lesson 1.1: fundamentals & conceptual overview of generative ai fundamentals & transformer architecture with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": true
            },
            {
                "id": "course-4-mod-1-les-2",
                "module_id": "course-4-mod-1",
                "course_id": "course-4",
                "title": "Lesson 1.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 1.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-1-les-3",
                "module_id": "course-4-mod-1",
                "course_id": "course-4",
                "title": "Lesson 1.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 1.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-1-les-4",
                "module_id": "course-4-mod-1",
                "course_id": "course-4",
                "title": "Lesson 1.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 1.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-2",
        "course_id": "course-4",
        "title": "Module 2: Self-Attention Mechanisms & Token Embeddings",
        "description": "Comprehensive module covering Module 2: Self-Attention Mechanisms & Token Embeddings with real datasets and practical programming tasks.",
        "order": 2,
        "lessons": [
            {
                "id": "course-4-mod-2-les-1",
                "module_id": "course-4-mod-2",
                "course_id": "course-4",
                "title": "Lesson 2.1: Fundamentals & Conceptual Overview of Self-Attention Mechanisms & Token Embeddings",
                "description": "Practical hands-on walkthrough for lesson 2.1: fundamentals & conceptual overview of self-attention mechanisms & token embeddings with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-2-les-2",
                "module_id": "course-4-mod-2",
                "course_id": "course-4",
                "title": "Lesson 2.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 2.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-2-les-3",
                "module_id": "course-4-mod-2",
                "course_id": "course-4",
                "title": "Lesson 2.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 2.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-2-les-4",
                "module_id": "course-4-mod-2",
                "course_id": "course-4",
                "title": "Lesson 2.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 2.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-3",
        "course_id": "course-4",
        "title": "Module 3: Advanced Prompt Engineering & Chain-of-Thought Systems",
        "description": "Comprehensive module covering Module 3: Advanced Prompt Engineering & Chain-of-Thought Systems with real datasets and practical programming tasks.",
        "order": 3,
        "lessons": [
            {
                "id": "course-4-mod-3-les-1",
                "module_id": "course-4-mod-3",
                "course_id": "course-4",
                "title": "Lesson 3.1: Fundamentals & Conceptual Overview of Advanced Prompt Engineering & Chain-of-Thought Systems",
                "description": "Practical hands-on walkthrough for lesson 3.1: fundamentals & conceptual overview of advanced prompt engineering & chain-of-thought systems with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-3-les-2",
                "module_id": "course-4-mod-3",
                "course_id": "course-4",
                "title": "Lesson 3.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 3.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-3-les-3",
                "module_id": "course-4-mod-3",
                "course_id": "course-4",
                "title": "Lesson 3.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 3.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-3-les-4",
                "module_id": "course-4-mod-3",
                "course_id": "course-4",
                "title": "Lesson 3.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 3.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-4",
        "course_id": "course-4",
        "title": "Module 4: Structured Output Parsing (Pydantic & JSON Schemas)",
        "description": "Comprehensive module covering Module 4: Structured Output Parsing (Pydantic & JSON Schemas) with real datasets and practical programming tasks.",
        "order": 4,
        "lessons": [
            {
                "id": "course-4-mod-4-les-1",
                "module_id": "course-4-mod-4",
                "course_id": "course-4",
                "title": "Lesson 4.1: Fundamentals & Conceptual Overview of Structured Output Parsing (Pydantic & JSON Schemas)",
                "description": "Practical hands-on walkthrough for lesson 4.1: fundamentals & conceptual overview of structured output parsing (pydantic & json schemas) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-4-les-2",
                "module_id": "course-4-mod-4",
                "course_id": "course-4",
                "title": "Lesson 4.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 4.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-4-les-3",
                "module_id": "course-4-mod-4",
                "course_id": "course-4",
                "title": "Lesson 4.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 4.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-4-les-4",
                "module_id": "course-4-mod-4",
                "course_id": "course-4",
                "title": "Lesson 4.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 4.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-5",
        "course_id": "course-4",
        "title": "Module 5: OpenAI, Gemini & Claude API Integration",
        "description": "Comprehensive module covering Module 5: OpenAI, Gemini & Claude API Integration with real datasets and practical programming tasks.",
        "order": 5,
        "lessons": [
            {
                "id": "course-4-mod-5-les-1",
                "module_id": "course-4-mod-5",
                "course_id": "course-4",
                "title": "Lesson 5.1: Fundamentals & Conceptual Overview of OpenAI, Gemini & Claude API Integration",
                "description": "Practical hands-on walkthrough for lesson 5.1: fundamentals & conceptual overview of openai, gemini & claude api integration with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-5-les-2",
                "module_id": "course-4-mod-5",
                "course_id": "course-4",
                "title": "Lesson 5.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 5.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-5-les-3",
                "module_id": "course-4-mod-5",
                "course_id": "course-4",
                "title": "Lesson 5.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 5.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-5-les-4",
                "module_id": "course-4-mod-5",
                "course_id": "course-4",
                "title": "Lesson 5.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 5.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-6",
        "course_id": "course-4",
        "title": "Module 6: Open-Source LLMs & Local Serving (Ollama, vLLM)",
        "description": "Comprehensive module covering Module 6: Open-Source LLMs & Local Serving (Ollama, vLLM) with real datasets and practical programming tasks.",
        "order": 6,
        "lessons": [
            {
                "id": "course-4-mod-6-les-1",
                "module_id": "course-4-mod-6",
                "course_id": "course-4",
                "title": "Lesson 6.1: Fundamentals & Conceptual Overview of Open-Source LLMs & Local Serving (Ollama, vLLM)",
                "description": "Practical hands-on walkthrough for lesson 6.1: fundamentals & conceptual overview of open-source llms & local serving (ollama, vllm) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-6-les-2",
                "module_id": "course-4-mod-6",
                "course_id": "course-4",
                "title": "Lesson 6.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 6.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-6-les-3",
                "module_id": "course-4-mod-6",
                "course_id": "course-4",
                "title": "Lesson 6.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 6.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-6-les-4",
                "module_id": "course-4-mod-6",
                "course_id": "course-4",
                "title": "Lesson 6.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 6.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-7",
        "course_id": "course-4",
        "title": "Module 7: Vector Databases & Semantic Search (Pinecone, ChromaDB)",
        "description": "Comprehensive module covering Module 7: Vector Databases & Semantic Search (Pinecone, ChromaDB) with real datasets and practical programming tasks.",
        "order": 7,
        "lessons": [
            {
                "id": "course-4-mod-7-les-1",
                "module_id": "course-4-mod-7",
                "course_id": "course-4",
                "title": "Lesson 7.1: Fundamentals & Conceptual Overview of Vector Databases & Semantic Search (Pinecone, ChromaDB)",
                "description": "Practical hands-on walkthrough for lesson 7.1: fundamentals & conceptual overview of vector databases & semantic search (pinecone, chromadb) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-7-les-2",
                "module_id": "course-4-mod-7",
                "course_id": "course-4",
                "title": "Lesson 7.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 7.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-7-les-3",
                "module_id": "course-4-mod-7",
                "course_id": "course-4",
                "title": "Lesson 7.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 7.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-7-les-4",
                "module_id": "course-4-mod-7",
                "course_id": "course-4",
                "title": "Lesson 7.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 7.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-8",
        "course_id": "course-4",
        "title": "Module 8: Retrieval-Augmented Generation (RAG) Foundations",
        "description": "Comprehensive module covering Module 8: Retrieval-Augmented Generation (RAG) Foundations with real datasets and practical programming tasks.",
        "order": 8,
        "lessons": [
            {
                "id": "course-4-mod-8-les-1",
                "module_id": "course-4-mod-8",
                "course_id": "course-4",
                "title": "Lesson 8.1: Fundamentals & Conceptual Overview of Retrieval-Augmented Generation (RAG) Foundations",
                "description": "Practical hands-on walkthrough for lesson 8.1: fundamentals & conceptual overview of retrieval-augmented generation (rag) foundations with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-8-les-2",
                "module_id": "course-4-mod-8",
                "course_id": "course-4",
                "title": "Lesson 8.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 8.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-8-les-3",
                "module_id": "course-4-mod-8",
                "course_id": "course-4",
                "title": "Lesson 8.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 8.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-8-les-4",
                "module_id": "course-4-mod-8",
                "course_id": "course-4",
                "title": "Lesson 8.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 8.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-9",
        "course_id": "course-4",
        "title": "Module 9: Fine-Tuning LLMs with LoRA & QLoRA",
        "description": "Comprehensive module covering Module 9: Fine-Tuning LLMs with LoRA & QLoRA with real datasets and practical programming tasks.",
        "order": 9,
        "lessons": [
            {
                "id": "course-4-mod-9-les-1",
                "module_id": "course-4-mod-9",
                "course_id": "course-4",
                "title": "Lesson 9.1: Fundamentals & Conceptual Overview of Fine-Tuning LLMs with LoRA & QLoRA",
                "description": "Practical hands-on walkthrough for lesson 9.1: fundamentals & conceptual overview of fine-tuning llms with lora & qlora with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-9-les-2",
                "module_id": "course-4-mod-9",
                "course_id": "course-4",
                "title": "Lesson 9.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 9.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-9-les-3",
                "module_id": "course-4-mod-9",
                "course_id": "course-4",
                "title": "Lesson 9.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 9.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-9-les-4",
                "module_id": "course-4-mod-9",
                "course_id": "course-4",
                "title": "Lesson 9.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 9.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-4-mod-10",
        "course_id": "course-4",
        "title": "Module 10: AI Safety, Guardrails & LLM Evaluation Benchmarks",
        "description": "Comprehensive module covering Module 10: AI Safety, Guardrails & LLM Evaluation Benchmarks with real datasets and practical programming tasks.",
        "order": 10,
        "lessons": [
            {
                "id": "course-4-mod-10-les-1",
                "module_id": "course-4-mod-10",
                "course_id": "course-4",
                "title": "Lesson 10.1: Fundamentals & Conceptual Overview of AI Safety, Guardrails & LLM Evaluation Benchmarks",
                "description": "Practical hands-on walkthrough for lesson 10.1: fundamentals & conceptual overview of ai safety, guardrails & llm evaluation benchmarks with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-4-mod-10-les-2",
                "module_id": "course-4-mod-10",
                "course_id": "course-4",
                "title": "Lesson 10.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 10.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-4-mod-10-les-3",
                "module_id": "course-4-mod-10",
                "course_id": "course-4",
                "title": "Lesson 10.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 10.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-4-mod-10-les-4",
                "module_id": "course-4-mod-10",
                "course_id": "course-4",
                "title": "Lesson 10.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 10.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    }
]
  },
  {
    id: "course-5",
    slug: "agentic-ai-engineer",
    title: "Agentic AI Engineer",
    description: "Master RAG architectures, Vector Databases (Pinecone, Chroma), LangChain, LangGraph stateful multi-agent systems, and MCP tools.",
    category: "Agentic AI",
    price: 3999,
    original_price: 14999,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    instructor_name: "Shaik Anwar",
    instructor_role: "Senior Data Scientist",
    difficulty: "Advanced",
    duration: "90 Hours",
    published: true,
    modules_count: 10,
    projects_count: 2,
    technologies: ["LangChain", "LangGraph", "Pinecone", "ChromaDB", "FAISS", "MCP", "FastAPI"],
    outcomes: [
      "Architect Production RAG pipelines with hybrid vector retrieval",
      "Orchestrate stateful multi-agent teams using LangGraph",
      "Implement Tool Calling, dynamic memory checkpoints, and human-in-the-loop",
      "Integrate Model Context Protocol (MCP) for enterprise agent workflows",
      "Deploy self-correcting autonomous agents into production environments",
      "Build multi-agent software development and resume evaluation pipelines"
    ],
    prerequisites: ["Stage 4 GenAI Engineering", "Intermediate Python & API skills"],
    target_audience: ["Senior AI Engineers", "Autonomous Agent Developers", "Solutions Architects"],
    modules: [
    {
        "id": "course-5-mod-1",
        "course_id": "course-5",
        "title": "Module 1: Introduction to Autonomous Agentic AI Systems",
        "description": "Comprehensive module covering Module 1: Introduction to Autonomous Agentic AI Systems with real datasets and practical programming tasks.",
        "order": 1,
        "lessons": [
            {
                "id": "course-5-mod-1-les-1",
                "module_id": "course-5-mod-1",
                "course_id": "course-5",
                "title": "Lesson 1.1: Fundamentals & Conceptual Overview of Introduction to Autonomous Agentic AI Systems",
                "description": "Practical hands-on walkthrough for lesson 1.1: fundamentals & conceptual overview of introduction to autonomous agentic ai systems with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": true
            },
            {
                "id": "course-5-mod-1-les-2",
                "module_id": "course-5-mod-1",
                "course_id": "course-5",
                "title": "Lesson 1.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 1.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-1-les-3",
                "module_id": "course-5-mod-1",
                "course_id": "course-5",
                "title": "Lesson 1.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 1.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-1-les-4",
                "module_id": "course-5-mod-1",
                "course_id": "course-5",
                "title": "Lesson 1.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 1.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-2",
        "course_id": "course-5",
        "title": "Module 2: Tool Calling & Function Execution Architecture",
        "description": "Comprehensive module covering Module 2: Tool Calling & Function Execution Architecture with real datasets and practical programming tasks.",
        "order": 2,
        "lessons": [
            {
                "id": "course-5-mod-2-les-1",
                "module_id": "course-5-mod-2",
                "course_id": "course-5",
                "title": "Lesson 2.1: Fundamentals & Conceptual Overview of Tool Calling & Function Execution Architecture",
                "description": "Practical hands-on walkthrough for lesson 2.1: fundamentals & conceptual overview of tool calling & function execution architecture with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-2-les-2",
                "module_id": "course-5-mod-2",
                "course_id": "course-5",
                "title": "Lesson 2.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 2.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-2-les-3",
                "module_id": "course-5-mod-2",
                "course_id": "course-5",
                "title": "Lesson 2.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 2.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-2-les-4",
                "module_id": "course-5-mod-2",
                "course_id": "course-5",
                "title": "Lesson 2.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 2.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-3",
        "course_id": "course-5",
        "title": "Module 3: Agentic Memory Systems (Short-Term, Long-Term, Checkpoints)",
        "description": "Comprehensive module covering Module 3: Agentic Memory Systems (Short-Term, Long-Term, Checkpoints) with real datasets and practical programming tasks.",
        "order": 3,
        "lessons": [
            {
                "id": "course-5-mod-3-les-1",
                "module_id": "course-5-mod-3",
                "course_id": "course-5",
                "title": "Lesson 3.1: Fundamentals & Conceptual Overview of Agentic Memory Systems (Short-Term, Long-Term, Checkpoints)",
                "description": "Practical hands-on walkthrough for lesson 3.1: fundamentals & conceptual overview of agentic memory systems (short-term, long-term, checkpoints) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-3-les-2",
                "module_id": "course-5-mod-3",
                "course_id": "course-5",
                "title": "Lesson 3.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 3.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-3-les-3",
                "module_id": "course-5-mod-3",
                "course_id": "course-5",
                "title": "Lesson 3.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 3.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-3-les-4",
                "module_id": "course-5-mod-3",
                "course_id": "course-5",
                "title": "Lesson 3.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 3.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-4",
        "course_id": "course-5",
        "title": "Module 4: LangChain & LCEL (LangChain Expression Language)",
        "description": "Comprehensive module covering Module 4: LangChain & LCEL (LangChain Expression Language) with real datasets and practical programming tasks.",
        "order": 4,
        "lessons": [
            {
                "id": "course-5-mod-4-les-1",
                "module_id": "course-5-mod-4",
                "course_id": "course-5",
                "title": "Lesson 4.1: Fundamentals & Conceptual Overview of LangChain & LCEL (LangChain Expression Language)",
                "description": "Practical hands-on walkthrough for lesson 4.1: fundamentals & conceptual overview of langchain & lcel (langchain expression language) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-4-les-2",
                "module_id": "course-5-mod-4",
                "course_id": "course-5",
                "title": "Lesson 4.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 4.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-4-les-3",
                "module_id": "course-5-mod-4",
                "course_id": "course-5",
                "title": "Lesson 4.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 4.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-4-les-4",
                "module_id": "course-5-mod-4",
                "course_id": "course-5",
                "title": "Lesson 4.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 4.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-5",
        "course_id": "course-5",
        "title": "Module 5: Advanced RAG (Hybrid Search, Re-Ranking, HyDE)",
        "description": "Comprehensive module covering Module 5: Advanced RAG (Hybrid Search, Re-Ranking, HyDE) with real datasets and practical programming tasks.",
        "order": 5,
        "lessons": [
            {
                "id": "course-5-mod-5-les-1",
                "module_id": "course-5-mod-5",
                "course_id": "course-5",
                "title": "Lesson 5.1: Fundamentals & Conceptual Overview of Advanced RAG (Hybrid Search, Re-Ranking, HyDE)",
                "description": "Practical hands-on walkthrough for lesson 5.1: fundamentals & conceptual overview of advanced rag (hybrid search, re-ranking, hyde) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-5-les-2",
                "module_id": "course-5-mod-5",
                "course_id": "course-5",
                "title": "Lesson 5.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 5.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-5-les-3",
                "module_id": "course-5-mod-5",
                "course_id": "course-5",
                "title": "Lesson 5.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 5.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-5-les-4",
                "module_id": "course-5-mod-5",
                "course_id": "course-5",
                "title": "Lesson 5.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 5.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-6",
        "course_id": "course-5",
        "title": "Module 6: LangGraph Stateful Multi-Agent Orchestration",
        "description": "Comprehensive module covering Module 6: LangGraph Stateful Multi-Agent Orchestration with real datasets and practical programming tasks.",
        "order": 6,
        "lessons": [
            {
                "id": "course-5-mod-6-les-1",
                "module_id": "course-5-mod-6",
                "course_id": "course-5",
                "title": "Lesson 6.1: Fundamentals & Conceptual Overview of LangGraph Stateful Multi-Agent Orchestration",
                "description": "Practical hands-on walkthrough for lesson 6.1: fundamentals & conceptual overview of langgraph stateful multi-agent orchestration with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-6-les-2",
                "module_id": "course-5-mod-6",
                "course_id": "course-5",
                "title": "Lesson 6.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 6.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-6-les-3",
                "module_id": "course-5-mod-6",
                "course_id": "course-5",
                "title": "Lesson 6.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 6.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-6-les-4",
                "module_id": "course-5-mod-6",
                "course_id": "course-5",
                "title": "Lesson 6.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 6.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-7",
        "course_id": "course-5",
        "title": "Module 7: Reasoning & Planning Frameworks (ReAct, Plan-and-Execute)",
        "description": "Comprehensive module covering Module 7: Reasoning & Planning Frameworks (ReAct, Plan-and-Execute) with real datasets and practical programming tasks.",
        "order": 7,
        "lessons": [
            {
                "id": "course-5-mod-7-les-1",
                "module_id": "course-5-mod-7",
                "course_id": "course-5",
                "title": "Lesson 7.1: Fundamentals & Conceptual Overview of Reasoning & Planning Frameworks (ReAct, Plan-and-Execute)",
                "description": "Practical hands-on walkthrough for lesson 7.1: fundamentals & conceptual overview of reasoning & planning frameworks (react, plan-and-execute) with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-7-les-2",
                "module_id": "course-5-mod-7",
                "course_id": "course-5",
                "title": "Lesson 7.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 7.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-7-les-3",
                "module_id": "course-5-mod-7",
                "course_id": "course-5",
                "title": "Lesson 7.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 7.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-7-les-4",
                "module_id": "course-5-mod-7",
                "course_id": "course-5",
                "title": "Lesson 7.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 7.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-8",
        "course_id": "course-5",
        "title": "Module 8: Multi-Agent Teams with CrewAI & AutoGen",
        "description": "Comprehensive module covering Module 8: Multi-Agent Teams with CrewAI & AutoGen with real datasets and practical programming tasks.",
        "order": 8,
        "lessons": [
            {
                "id": "course-5-mod-8-les-1",
                "module_id": "course-5-mod-8",
                "course_id": "course-5",
                "title": "Lesson 8.1: Fundamentals & Conceptual Overview of Multi-Agent Teams with CrewAI & AutoGen",
                "description": "Practical hands-on walkthrough for lesson 8.1: fundamentals & conceptual overview of multi-agent teams with crewai & autogen with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-8-les-2",
                "module_id": "course-5-mod-8",
                "course_id": "course-5",
                "title": "Lesson 8.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 8.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-8-les-3",
                "module_id": "course-5-mod-8",
                "course_id": "course-5",
                "title": "Lesson 8.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 8.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-8-les-4",
                "module_id": "course-5-mod-8",
                "course_id": "course-5",
                "title": "Lesson 8.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 8.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-9",
        "course_id": "course-5",
        "title": "Module 9: Model Context Protocol (MCP) Enterprise Interoperability",
        "description": "Comprehensive module covering Module 9: Model Context Protocol (MCP) Enterprise Interoperability with real datasets and practical programming tasks.",
        "order": 9,
        "lessons": [
            {
                "id": "course-5-mod-9-les-1",
                "module_id": "course-5-mod-9",
                "course_id": "course-5",
                "title": "Lesson 9.1: Fundamentals & Conceptual Overview of Model Context Protocol (MCP) Enterprise Interoperability",
                "description": "Practical hands-on walkthrough for lesson 9.1: fundamentals & conceptual overview of model context protocol (mcp) enterprise interoperability with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-9-les-2",
                "module_id": "course-5-mod-9",
                "course_id": "course-5",
                "title": "Lesson 9.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 9.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-9-les-3",
                "module_id": "course-5-mod-9",
                "course_id": "course-5",
                "title": "Lesson 9.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 9.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-9-les-4",
                "module_id": "course-5-mod-9",
                "course_id": "course-5",
                "title": "Lesson 9.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 9.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    },
    {
        "id": "course-5-mod-10",
        "course_id": "course-5",
        "title": "Module 10: Human-in-the-Loop Workflows & Production Deployment",
        "description": "Comprehensive module covering Module 10: Human-in-the-Loop Workflows & Production Deployment with real datasets and practical programming tasks.",
        "order": 10,
        "lessons": [
            {
                "id": "course-5-mod-10-les-1",
                "module_id": "course-5-mod-10",
                "course_id": "course-5",
                "title": "Lesson 10.1: Fundamentals & Conceptual Overview of Human-in-the-Loop Workflows & Production Deployment",
                "description": "Practical hands-on walkthrough for lesson 10.1: fundamentals & conceptual overview of human-in-the-loop workflows & production deployment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "15 mins",
                "order": 1,
                "is_preview": false
            },
            {
                "id": "course-5-mod-10-les-2",
                "module_id": "course-5-mod-10",
                "course_id": "course-5",
                "title": "Lesson 10.2: Core Syntax, Functions & Implementation",
                "description": "Practical hands-on walkthrough for lesson 10.2: core syntax, functions & implementation with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "20 mins",
                "order": 2,
                "is_preview": false
            },
            {
                "id": "course-5-mod-10-les-3",
                "module_id": "course-5-mod-10",
                "course_id": "course-5",
                "title": "Lesson 10.3: Real-World Industry Application & Pipeline",
                "description": "Practical hands-on walkthrough for lesson 10.3: real-world industry application & pipeline with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "25 mins",
                "order": 3,
                "is_preview": false
            },
            {
                "id": "course-5-mod-10-les-4",
                "module_id": "course-5-mod-10",
                "course_id": "course-5",
                "title": "Lesson 10.4: Optimization, Code Review & Module Assignment",
                "description": "Practical hands-on walkthrough for lesson 10.4: optimization, code review & module assignment with runnable Jupyter notebooks and exercises.",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "duration": "30 mins",
                "order": 4,
                "is_preview": false
            }
        ]
    }
]
  }
];
