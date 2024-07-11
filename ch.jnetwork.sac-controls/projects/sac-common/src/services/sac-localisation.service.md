# Uages

Create your own service for the translation of resource keys into texts. If you want to change the standard keys of the texts, implement a service with the interface `ISacValidationKeyService` to change the keys.

# Example implementation

The sample implementation using ngx-translate

```ts
@Injectable()
export class ControlsLocalisation extends SacLocalisationService {
  constructor(private translate: TranslateService) {
    super();

    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }

  public GetString(key: string, params?: any): Observable<string> {
    return this.translate.get(key, params);
  }
}
```
