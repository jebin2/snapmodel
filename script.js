// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading initially
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // Show empty state initially if no model is loaded
        if (gridContainer.children.length === 0) {
            emptyState.style.display = 'flex'; // Use flex for vertical centering
            gridContainer.style.display = 'none';
        }
    }, 500);

    const searchBtn = document.getElementById('search-btn');
    const modelSearch = document.getElementById('search-input');
    const gridContainer = document.getElementById('grid-container');
    const emptyState = document.getElementById('empty-state');
	let masonryInstance = null; // Variable to hold the Masonry instance
	// --- Debounced Resize Handler ---
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // --- THE RESIZE HANDLER ---
    const handleResize = debounce(function() {
		updateModelDisplay("ByteDance-Seed/UI-TARS-1.5-7B");
    }, 250); // Adjust debounce time (ms) if needed

    window.addEventListener('resize', handleResize);

    // --- Function to Calculate and Set Item Widths ---
    function setItemWidths() {
        if (!gridContainer) return 0; // Return 0 if no container

        const gutter = 24;
        const numberOfColumns = 3; // Adjust if you want responsiveness here later
        const containerStyle = window.getComputedStyle(gridContainer);
        const containerPaddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
        const containerPaddingRight = parseFloat(containerStyle.paddingRight) || 0;
        const containerContentWidth = gridContainer.clientWidth - containerPaddingLeft - containerPaddingRight;

        if (containerContentWidth <= 0) return 0; // Avoid division by zero or negative width

        const totalGutterWidth = (numberOfColumns - 1) * gutter;
        const availableWidth = containerContentWidth - totalGutterWidth;
        let itemWidth = Math.floor(availableWidth / numberOfColumns);
        itemWidth = Math.max(itemWidth, 250); // Minimum width safeguard

        const gridItems = gridContainer.querySelectorAll('.grid-item');
        // console.log(`[Set Widths] ContainerWidth: ${containerContentWidth}, ItemWidth: ${itemWidth}`); // Debugging log

        gridItems.forEach(item => {
            item.style.width = itemWidth + 'px';
        });

        return itemWidth; // Return the calculated width
    }

    // --- Template Functions ---
    function createElementFromTemplate(templateId) {
        const template = document.getElementById(templateId);
        if (!template) {
            console.error(`Template with id "${templateId}" not found.`);
            return null; // Return null or an empty document fragment
        }
        return document.importNode(template.content, true);
    }

    // --- Helper Functions ---
    function createBadge(text, type = '') {
        const badge = document.createElement('span');
        badge.className = `badge ${type ? `badge-${type}` : ''}`;

        // Clean up text for badges (e.g., remove version numbers, details in parens)
        const cleanText = text.split(/[<(]/)[0].trim(); // Split by '<' or '('
        badge.textContent = cleanText;
        badge.title = text; // Keep full text in title attribute
        badge.dataset.type = type;

        return badge;
    }

    function formatContextLength(contextString) {
        if (!contextString) return { value: 'N/A', detail: '' };
        const match = contextString.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*tokens/i); // Match numbers with or without commas
        if (match && match[1]) {
            const tokens = parseInt(match[1].replace(/,/g, ''), 10);
            const kTokens = Math.round(tokens / 1024);
            let detail = contextString.includes('(Configurable)') ? '(Configurable)' : '';
            return { value: `~${kTokens}K`, detail: `Up to ${tokens.toLocaleString()} tokens ${detail}`.trim() };
        }
        // Fallback if no token number found
        return { value: contextString.split('(')[0].trim() || 'Large', detail: contextString.includes('Configurable') ? 'Configurable' : 'See documentation' };
    }


    function formatDate(dateString) {
        if (!dateString) return { value: 'N/A', detail: '' };
        try {
            // Extract YYYY-MM-DD part if extra text exists
            const datePartMatch = dateString.match(/\d{4}-\d{2}-\d{2}/);
            if (!datePartMatch) return { value: dateString.split('(')[0].trim(), detail: dateString.includes('(') ? dateString.substring(dateString.indexOf('(')) : '' };

            const datePart = datePartMatch[0];
            const date = new Date(datePart + 'T00:00:00Z'); // Assume UTC date

            let detail = '';
            if (dateString.includes('Open-sourced')) {
                detail = 'Open-sourced';
            }

            return {
                value: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' }),
                detail: detail
            };
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return {
                value: dateString.split('(')[0].trim(),
                detail: ''
            };
        }
    }

    // --- Card Creator Functions ---
    function createHeroCard(model) {
        const bi = model.basic_information || {};
        const fragment = createElementFromTemplate('hero-template');
        if (!fragment) return null;

        fragment.querySelector(`[data-field="category"]`).textContent = bi.creator || 'N/A';
        fragment.querySelector(`[data-field="title"]`).textContent = model.model_name || 'N/A';
        fragment.querySelector(`[data-field="description"]`).textContent = bi.architecture || 'Description not available';

        const imgElement = fragment.querySelector(`[data-field="image"]`);
        imgElement.src = bi.model_image_url || 'https://img.freepik.com/free-psd/technology-icon-rendering_23-2150613827.jpg?uid=R194952773&ga=GA1.1.1096082398.1744815409&semt=ais_hybrid&w=740';
        imgElement.alt = `${model.model_name || 'Model'} Visualization`;

        return fragment;
    }

    function createDetailCard(label, value, subtext = '') {
        const fragment = createElementFromTemplate('detail-template');
         if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;
        fragment.querySelector(`[data-field="label"]`).textContent = value || 'N/A';

        const subdetail = fragment.querySelector(`[data-field="subtext"]`);
        if (subtext) {
            subdetail.textContent = subtext;
            subdetail.style.display = 'block'; // Ensure it's visible
        } else {
            subdetail.style.display = 'none'; // Hide if no subtext
        }

        return fragment;
    }

    function createTextCard(label, content) {
        const fragment = createElementFromTemplate('text-template');
        if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;

        const contentElement = fragment.querySelector('#text-content');
        contentElement.textContent = content || 'No information available.';

        return fragment;
    }

    function createBadgeCard(label, items, badgeTypeMap = {}) {
        const fragment = createElementFromTemplate('badge-template');
        if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;

        const container = fragment.querySelector(`[data-field="badge-container"]`);
        container.innerHTML = ''; // Clear any default content

        if (!items || items.length === 0) {
            const badge = createBadge('N/A');
            container.appendChild(badge);
            return fragment;
        }

        items.forEach(item => {
            const text = typeof item === 'string' ? item : 'Invalid Item';
            const cleanText = text.split(/[<(]/)[0].trim(); // Use the same cleaning logic as createBadge

            let badgeType = '';
            // Apply specific badge types based on content
            if (badgeTypeMap[cleanText]) {
                badgeType = badgeTypeMap[cleanText];
            } else if (cleanText === 'GGUF' || cleanText === 'llama.cpp') {
                badgeType = 'warning';
            } else if (cleanText === 'AWQ' || cleanText === 'GPTQ') {
                badgeType = 'info';
            } else if (cleanText === 'PyTorch' || cleanText === 'Transformers' || cleanText === 'vLLM') {
                 badgeType = 'primary';
            } else if (cleanText === 'GUI Automation' || cleanText === 'Task Automation') {
                badgeType = 'success';
            } else if (cleanText === 'Visual Grounding' || cleanText === 'Screen Understanding') {
                 badgeType = 'secondary'; // Assuming secondary class exists
            } else if (cleanText === 'Cloud (HF Endpoints)' || cleanText === 'Cloud VMs' || cleanText === 'Local') {
                badgeType = 'info';
            } else if (cleanText === 'Local deployment' || cleanText === 'API access' || cleanText === 'Docker containers') {
                badgeType = 'info';
            }

            const badge = createBadge(text, badgeType);
            container.appendChild(badge);
        });

        return fragment;
    }

	function createTableCard(label, rows) {
        const fragment = createElementFromTemplate('table-template');
        if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;

        const table = fragment.querySelector(`[data-field="table"]`);
        table.innerHTML = ''; // Clear any default content

        const tbody = document.createElement('tbody'); // Use tbody for structure

        if (!rows || rows.length === 0) {
             const tr = document.createElement('tr');
             const td = document.createElement('td');
             td.colSpan = 2;
             td.textContent = 'No data available.';
             tr.appendChild(td);
             tbody.appendChild(tr);
        } else {
            rows.forEach(row => {
                const tr = document.createElement('tr');

                const tdLabel = document.createElement('td');
                tdLabel.textContent = row.label;
                tr.appendChild(tdLabel);

                const tdValue = document.createElement('td');
                const valueContent = Array.isArray(row.value) ? row.value.join(', ') : (row.value || 'N/A');

                // Display main value
                const valueSpan = document.createElement('span');
                valueSpan.textContent = valueContent;
                tdValue.appendChild(valueSpan);

                // Display detail/subtext if it exists
                if (row.detail) {
                    const detailSpan = document.createElement('span');
                    detailSpan.className = 'sub-detail'; // Reuse class for similar styling
                    detailSpan.textContent = row.detail;
                    detailSpan.style.display = 'block'; // Ensure it's on a new line
                    detailSpan.style.marginLeft = '0';   // Reset margin if needed
                    tdValue.appendChild(detailSpan);
                }

                tr.appendChild(tdValue);
                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        return fragment;
    }

     function createLinksCard(label, links) {
        const fragment = createElementFromTemplate('links-template');
        if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;

        const container = fragment.querySelector(`[data-field="links-container"]`);
        container.innerHTML = ''; // Clear any default content

        if (!links || links.length === 0) {
            container.textContent = 'No links available.';
            return fragment;
        }

        links.forEach(link => {
            if (!link || !link.url) return; // Skip invalid links
			link.url = link.url.trim().split(" ")[0]
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'resource-link';
            a.target = '_blank'; // Open in new tab
            a.rel = 'noopener noreferrer'; // Security best practice

            // Determine icon based on URL or predefined icon
            let iconClass = link.icon; // Use provided icon if available
            if (!iconClass) {
                if (link.url.includes('github.com')) {
                    iconClass = 'fab fa-github';
                } else if (link.url.includes('huggingface.co')) {
                    iconClass = 'fas fa-face-smile'; // Or any relevant HF icon/image
                } else if (link.url.includes('arxiv.org')) {
                    iconClass = 'fas fa-file-alt';
                } else if (link.url.includes('bytedance.com')) {
                     iconClass = 'fas fa-building'; // Example for company site
                } else {
                    iconClass = 'fas fa-link'; // Default link icon
                }
            }

            const icon = document.createElement('i');
            icon.className = iconClass;
            a.appendChild(icon);

            // Determine link text
            let linkText = link.url;
            // if (!linkText) {
            //     // Try to generate text from URL
            //     try {
            //         const urlObj = new URL(link.url);
            //         linkText = urlObj.hostname.replace(/^www\./, ''); // Remove www.
            //         if (urlObj.pathname !== '/' && urlObj.pathname.length > 1) {
            //              // Add last part of path if meaningful
            //              const pathParts = urlObj.pathname.split('/').filter(Boolean);
            //              if (pathParts.length > 0) {
            //                  linkText += ` / ... / ${pathParts[pathParts.length - 1]}`;
            //              }
            //         }
            //     } catch (e) {
            //         linkText = link.url; // Fallback to full URL if parsing fails
            //     }
            // }


            const textNode = document.createTextNode(` ${linkText}`); // Add space after icon
            a.appendChild(textNode);

            container.appendChild(a);
        });

        return fragment;
    }

    function createListCard(label, items) {
        const fragment = createElementFromTemplate('text-template'); // Reuse text template structure
         if (!fragment) return null;

        fragment.querySelector(`[data-field="label"]`).textContent = label;

        const content = fragment.querySelector(`[data-field="content"]`);
        content.innerHTML = ''; // Clear default text

        if (!items || items.length === 0) {
            content.textContent = 'None specified.';
            return fragment;
        }

        const ul = document.createElement('ul');
        ul.className = 'details-list'; // Add a class for potential styling

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });

        content.appendChild(ul);

        return fragment;
    }

        // --- Main Display Function ---
		function updateModelDisplay(modelKey) {
			const model = modelDataStore[modelKey];
	
			document.getElementById('loader').classList.remove('hidden'); // Show loader during processing
			gridContainer.style.display = 'none';
			emptyState.style.display = 'none';

			// Destroy previous Masonry instance FIRST
			if (masonryInstance) {
				console.log("Destroying previous Masonry instance.");
				try {
					 masonryInstance.destroy();
				} catch (e) {
					 console.error("Error destroying masonry:", e);
				}
				masonryInstance = null; // Clear the reference
			}
			// Clear container HTML AFTER destroying instance
			gridContainer.innerHTML = '';
			// Simulate slight delay for loader visibility
			setTimeout(() => {
				if (!model) {
					gridContainer.innerHTML = ''; // Clear just in case
					gridContainer.style.display = 'none';
					emptyState.style.display = 'flex'; // Use flex
					emptyState.querySelector('h2').textContent = 'Model Not Found';
					emptyState.querySelector('p').textContent = `Could not find data for "${modelKey}". Please check the name and try again.`;
					document.getElementById('loader').classList.add('hidden');
					return;
				}
	
				gridContainer.innerHTML = ''; // Clear previous content
	
				const bi = model.basic_information || {};
				const sr = model.system_requirements || {};
				const td = model.technical_details || {};
				const ui = model.usage_information || {};
				const sr_min = sr.minimum || {};
				const sr_rec = sr.recommended || {};
	
				// --- Create and Append Cards ---
				const cards = [];
	
				// 1. Hero Card
				cards.push(createHeroCard(model));
	
				// 2. Key Specifications Card (Combined)
				const context = formatContextLength(bi.context_length);
				const release = formatDate(bi.release_date);
				const keySpecRows = [
					{ label: 'Parameters', value: bi.parameters }, // Assuming no sub-detail needed for parameters
					{ label: 'Context Length', value: context.value, detail: context.detail },
					{ label: 'Released', value: release.value, detail: release.detail }
				].filter(row => row.value || row.detail); // Keep row if value or detail exists
				// Add card only if there are valid rows
				if(keySpecRows.length > 0) {
					 cards.push(createTableCard('Key Specifications', keySpecRows));
				}
	
	
				// 3. Quantization Badges
				cards.push(createBadgeCard('Quantization', bi.quantization_options));
	
				// 4. Framework Compatibility Badges
				cards.push(createBadgeCard('Frameworks', td.framework_compatibility));
	
				 // 5. Use Cases Badges
				cards.push(createBadgeCard('Use Cases', ui.primary_use_cases));
	
				// 6. Deployment Options Badges
				cards.push(createBadgeCard('Deployment', td.deployment_options));
	
				// 7. System Requirements (Min) Table
				const minReqRows = [
					{ label: 'RAM', value: sr_min.ram },
					{ label: 'VRAM', value: sr_min.vram },
					{ label: 'Disk', value: sr_min.disk_space },
					{ label: 'OS', value: sr_min.os },
					{ label: 'CPU', value: sr_min.cpu },
					{ label: 'GPU', value: sr_min.gpu },
				].filter(row => row.value); // Filter out rows with no value
				if (minReqRows.length > 0) {
					cards.push(createTableCard('System Requirements (Minimum)', minReqRows));
				}
	
				// 8. System Requirements (Recommended) Table
				const recReqRows = [
					{ label: 'RAM', value: sr_rec.ram },
					{ label: 'VRAM', value: sr_rec.vram },
					{ label: 'Disk', value: sr_rec.disk_space },
					{ label: 'OS', value: sr_rec.os },
					{ label: 'CPU', value: sr_rec.cpu },
					{ label: 'GPU', value: sr_rec.gpu },
				].filter(row => row.value); // Filter out rows with no value
				if (recReqRows.length > 0) {
					 cards.push(createTableCard('System Requirements (Recommended)', recReqRows));
				}
	
				// 9. Dependencies List
				cards.push(createListCard('Dependencies', td.dependencies));
	
				// 10. Hardware Notes/Limitations List
				cards.push(createListCard('Hardware Notes', td.hardware_limitations));
	
				// 11. Inference Speed Note
				if (td.inference_speed?.note) {
					 cards.push(createTextCard('Inference Note', td.inference_speed.note));
				}
	
				// 12. Resources & Links
				const allLinks = [];
				(ui.documentation || []).forEach(url => { if(url) allLinks.push({ url: url, text: 'Documentation' })});
				(ui.additional_resources || []).forEach(url => { if(url) allLinks.push({ url: url, text: 'Resource' })});
				if (allLinks.length > 0) {
					cards.push(createLinksCard('Resources & Links', allLinks));
				}
	
				// Append all created cards to the grid container
				cards.forEach(card => {
					if (card) { // Only append if card creation was successful
						gridContainer.appendChild(card);
					}
				});
	
				
				gridContainer.style.display = 'block'; // Use block as Masonry controls layout

				// --- Calculate and Apply Item Widths ---
				const initialItemWidth = setItemWidths();
				 // --- End Width Calculation ---
	
				emptyState.style.display = 'none'; // Hide empty state
				document.getElementById('loader').classList.add('hidden');

				// Initialize Masonry AFTER cards are added AND sized
				if (initialItemWidth > 0) {
					imagesLoaded( gridContainer, function() {
					  console.log("Images loaded, initializing Masonry.");
					  try {
						   masonryInstance = new Masonry( gridContainer, {
							itemSelector: '.grid-item',
							columnWidth: initialItemWidth, // Use calculated pixel width
							percentPosition: false,        // Use pixels
							gutter: 24,                    // Match calculation
							initLayout: true               // Layout on init
						  });
						  console.log("Masonry instance created:", masonryInstance);
					  } catch (e) {
						  console.error("Error initializing Masonry:", e);
					  }
					});
				} else {
					console.error("Skipping Masonry initialization due to zero item width.");
				}
	
			}, 150); // Short delay to allow loader to show
	
		}

    // --- Event Listeners ---
    function handleSearch() {
        const searchTerm = modelSearch.value.trim();
        if (searchTerm) {
			document.getElementById('loader').classList.remove('hidden');
			// gridContainer.style.display = 'none'; // Hiding handled in updateModelDisplay
			emptyState.style.display = 'none';
			updateModelDisplay(searchTerm);
        } else {
			// Clear results and show empty state
			if (masonryInstance) {
				try {
				   masonryInstance.destroy();
				} catch(e) { console.error("Error destroying masonry on clear:", e); }
				masonryInstance = null;
			}
             // Maybe reset to empty state if search is cleared?
             gridContainer.innerHTML = '';
             gridContainer.style.display = 'none';
             emptyState.style.display = 'flex';
             emptyState.querySelector('h2').textContent = 'Discover Your AI Model';
             emptyState.querySelector('p').textContent = 'Start by searching for a model name above. Detailed specifications will be displayed in this clean, modern interface.';
        }
    }

    searchBtn.addEventListener('click', handleSearch);

    modelSearch.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if it were in a form
            handleSearch();
        }
    });

    // --- Initial State Check (Optional) ---
    // If you want to load a default model on page load, you could do:
    updateModelDisplay("ByteDance-Seed/UI-TARS-1.5-7B");
    // Otherwise, the empty state will show as handled by the initial loader timeout.

});