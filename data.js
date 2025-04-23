// Sample data structure for model information
const modelDataStore = {
    "ByteDance-Seed/UI-TARS-1.5-7B": {
		"model_name": "ByteDance-Seed/UI-TARS-1.5-7B",
		"basic_information": {
			"architecture": "Vision-Language Model (likely based on Qwen2-VL)",
			"parameters": "7B (Hugging Face reports 8.29B)",
			"context_length": "Potentially large (up to 65536 tokens mentioned in deployment guide, but practical limit for vision-language might differ)",
			"quantization_options": [
				"Not explicitly mentioned, but base models often support GGUF, AWQ, GPTQ. Needs confirmation."
			],
			"release_date": "April 16, 2025 (Open-sourced date)",
			"creator": "ByteDance-Seed (ByteDance)",
			"model_image_url": null
		},
		"system_requirements": {
			"minimum": {
				"ram": "32GB (Estimated based on model size and typical overhead)",
				"vram": "18GB (Source [3] mentions 18GB VRAM usage) - Potentially RTX 3090 (24GB) or similar [3]",
				"disk_space": "35GB+ (Model files are ~33GB + dependencies)",
				"os": [
					"Linux",
					"Windows (via WSL or compatible environments)",
					"macOS (with appropriate hardware)"
				],
				"cpu": "Modern multi-core CPU (Estimated)",
				"gpu": "NVIDIA GPU with CUDA support and >=18GB VRAM (e.g., RTX 3090) [3]"
			},
			"recommended": {
				"ram": "64GB+ (Estimated)",
				"vram": "24GB - 48GB (e.g., NVIDIA RTX 3090/4090, A6000, L4) [2, 3]",
				"disk_space": "50GB+ (Estimated)",
				"os": [
					"Linux"
				],
				"cpu": "High-performance multi-core CPU (Estimated)",
				"gpu": "NVIDIA A100 (40GB), L40S (48GB), H100 (80GB) [2, 3]"
			}
		},
		"technical_details": {
			"framework_compatibility": [
				"PyTorch",
				"Transformers",
				"vLLM [16]"
			],
			"inference_speed": {
				"tokens_per_second": "Reported as 12 tokens/sec on unspecified hardware [3]",
				"latency": "Not specified"
			},
			"deployment_options": [
				"Local deployment via vLLM [16]",
				"Hugging Face Inference Endpoints [2]",
				"UI-TARS Desktop application integration [1, 20]"
			],
			"dependencies": [
				"torch",
				"torchvision",
				"transformers",
				"vllm [16]",
				"Pillow",
				"openai (for API usage example) [2]"
			],
			"hardware_limitations": [
				"Significant VRAM requirement (>18GB) for full precision [3]",
				"Slower inference speed compared to text-only models [3]",
				"Optimized primarily for general computer use, potentially less performant in specific game scenarios compared to the larger UI-TARS-1.5 model [13, 14]"
			]
		},
		"usage_information": {
			"primary_use_cases": [
				"GUI (Graphical User Interface) automation [1, 10]",
				"Screen understanding and visual grounding [1]",
				"Controlling desktop and mobile environments via natural language [1, 20]",
				"Web navigation and interaction [13]",
				"Game playing assistance (though potentially less optimized than larger model) [1, 13]"
			],
			"deployment_scenarios": [
				"Local AI agent for desktop automation [16, 20]",
				"Backend for GUI automation tools [1]",
				"Research in multimodal AI agents [1, 13]"
			],
			"documentation": [
				"https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B",
				"https://github.com/bytedance/UI-TARS",
				"https://github.com/bytedance/UI-TARS/blob/main/README_deploy.md [2]",
				"https://github.com/bytedance/UI-TARS-desktop/blob/main/docs/quick-start.md [20]"
			],
			"additional_resources": [
				"https://arxiv.org/abs/2501.12326 (Original UI-TARS paper) [19]",
				"https://www.marktechpost.com/2025/04/21/bytedance-releases-ui-tars-1-5-an-open-source-multimodal-ai-agent-built-upon-a-powerful-vision-language-model/ [1]",
				"https://github.com/bytedance/UI-TARS-desktop (Desktop Application) [9]"
			]
		},
		"visual_resources": {
			"model_architecture_diagram_url": null,
			"performance_comparison_charts_url": "Available in the Hugging Face model card README [14] and GitHub README [13]",
			"other_relevant_visual_resources": null
		},
		"information_sources": {
			"source1": {
				"url": "https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B",
				"used_for": [
					"Model name",
					"Creator",
					"Parameter count (reported)",
					"File sizes",
					"Framework tags",
					"Release info (commits)",
					"Basic description",
					"Performance benchmarks"
				]
			},
			"source2": {
				"url": "https://github.com/bytedance/UI-TARS",
				"used_for": [
					"Release date announcement",
					"Model capabilities",
					"Deployment guide link",
					"Use cases",
					"Limitations",
					"Performance benchmarks"
				]
			},
			"source3": {
				"url": "https://github.com/bytedance/UI-TARS/blob/main/README_deploy.md",
				"used_for": [
					"Deployment recommendations (GPU, config)",
					"Dependencies (openai example)",
					"API usage context"
				]
			},
			"source4": {
				"url": "https://www.marktechpost.com/2025/04/21/bytedance-releases-ui-tars-1-5-an-open-source-multimodal-ai-agent-built-upon-a-powerful-vision-language-model/",
				"used_for": [
					"Model description",
					"Use cases",
					"Performance context",
					"Availability links"
				]
			},
			"source5": {
				"url": "https://efficientcoder.net/ui-tars-1-5-the-next-evolution-in-automated-gui-interaction/",
				"used_for": [
					"VRAM usage (18GB)",
					"Inference speed (12 tokens/sec)",
					"Hardware recommendations (RTX 3090, A100, A6000, H100)"
				]
			},
			"source6": {
				"url": "https://www.youtube.com/watch?v=m6f6923iKjY (UI-TARS-1.5 Model with MidScene)",
				"used_for": [
					"VRAM usage confirmation (shows ~73GB for a potentially larger/different UI-TARS version)",
					"Installation dependencies (torch, torchvision, vllm)",
					"Local deployment context (vLLM)"
				]
			},
			"source7": {
				"url": "https://github.com/bytedance/UI-TARS-desktop/blob/main/docs/quick-start.md",
				"used_for": [
					"Desktop app integration",
					"Deployment context"
				]
			},
			"estimates": {
				"estimated_values": [
					"Minimum/Recommended RAM",
					"Minimum CPU",
					"Disk space",
					"Quantization options",
					"Context Length (practical)",
					"Architecture details (Qwen2-VL assumption)"
				],
				"reasoning": "Based on model size (7B/8.29B parameters), typical requirements for multimodal models of this scale, file sizes listed on Hugging Face, and common practices for similar models. Qwen2-VL is mentioned as the likely base in source [17]."
			}
		}
	}
};