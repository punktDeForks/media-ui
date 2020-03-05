import * as React from 'react';
import { createUseMediaUiStyles } from '../../core/MediaUiThemeProvider';
import MediaUiTheme from '../../interfaces/MediaUiTheme';
import { useIntl } from '../../core/Intl';
import { useMediaUi } from '../../core/MediaUi';
import { useRef } from 'react';

const useStyles = createUseMediaUiStyles((theme: MediaUiTheme) => ({
    searchBox: {
        '.neos & input': {
            width: '100%'
        }
    }
}));

export default function SearchBox() {
    const classes = useStyles();
    const { searchTerm, setSearchTerm } = useMediaUi();
    const { translate } = useIntl();
    const searchInput = useRef(null);

    const submitSearch = () => {
        setSearchTerm(searchInput.current.value);
    };

    return (
        <div className={classes.searchBox}>
            <input
                type="search"
                ref={searchInput}
                onKeyPress={e => e.key === 'Enter' && submitSearch()}
                placeholder={translate('searchBox.placeholder', 'Search')}
            />
        </div>
    );
}
