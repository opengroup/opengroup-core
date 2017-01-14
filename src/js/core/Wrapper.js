import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Theme from 'OpenGroup/theme/Theme';

/**
 */
class Wrapper extends EventEmitter {

    groupDefinitions = [];
    groups = [];
    theme = false;

    /**
     * @constructor
     */
    constructor () {
        super();

        this.parseGroupFromUrl();

        this.groupDefinitions.forEach((groupDefinition) => {
            this.groups.push(new OpenGroup(groupDefinition));
        });

        this.theme = new Theme(this);
    }

    parseGroupFromUrl () {
        var hash = decodeURIComponent(window.location.hash.substr(1));
        if (!hash) { return }
        var json = JSON.parse(hash);
        this.groupDefinitions.push(json);
        // window.location.hash = ''
    }

}

export default Wrapper;


