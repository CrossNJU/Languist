/**
 * Created by raychen on 16/7/22.
 */

import {getCountData} from './HomeService'
import {connect_mongo} from './setup'

connect_mongo();
getCountData('RobertDober', (v) => console.log(v));
