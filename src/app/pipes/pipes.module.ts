import { NgModule } from '@angular/core';
import { KeyTranslationPipe } from './keyTranslation.pipe';
import { KeyValueDelPipe } from './keyValueDel.pipe';
import { ObjectKeysPipe } from './ObjectKeys.pipe';
import { TimeVerifyPipe } from './timeVerify.pipe';
@NgModule({
    declarations:
        [
            KeyTranslationPipe,
            KeyValueDelPipe,
            ObjectKeysPipe,
            TimeVerifyPipe
        ],
    imports: [],
    exports:
        [
            KeyTranslationPipe,
            KeyValueDelPipe,
            ObjectKeysPipe,
            TimeVerifyPipe
        ]
})
export class PipesModule { }
