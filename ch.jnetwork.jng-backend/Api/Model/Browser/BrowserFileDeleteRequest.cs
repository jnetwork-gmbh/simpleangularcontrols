﻿namespace AngularPrototype.Api.Model.Browser
{
    /// <summary>
    /// Request für Datei die gelöscht werden soll
    /// </summary>
    public class BrowserFileDeleteRequest
    { /// <summary>
      /// File welches gelöscht werden soll
      /// </summary>
        public string Path { get; set; }
        /// <summary>
        /// Filter nach Datei Erweiterung
        /// </summary>
        public string AllowedTypes { get; set; }

    }
}