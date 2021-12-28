function observeChangesAndInitPopovers(){

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('root');
    
    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };
    
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                $('[data-toggle="popover"]').popover();
            }
        }
    };
    
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    }
    observeChangesAndInitPopovers();