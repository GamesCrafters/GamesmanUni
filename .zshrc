
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/anaishadas/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/anaishadas/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/anaishadas/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/anaishadas/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/anaishadas/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/anaishadas/google-cloud-sdk/path.zsh.inc'; 
# The next line enables shell command completion for gcloud.
if # The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/anaishadas/google-cloud-sdk/path.zsh.inc' ]; then
    . '/Users/anaishadas/google-cloud-sdk/path.zsh.inc'
fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/anaishadas/google-cloud-sdk/completion.zsh.inc' ]; then
    . '/Users/anaishadas/google-cloud-sdk/completion.zsh.inc'
fi[ -f '/Users/anaishadas/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/anaishadas/google-cloud-sdk/completion.zsh.inc'; 

export PATH="$PATH:$(go env GOPATH)/bin"


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
