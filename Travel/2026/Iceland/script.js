window.addEventListener("DOMContentLoaded", () => {
  const mapQueries = new Map([
    ["Arrive at SEA", "Seattle-Tacoma International Airport"],
    ["Depart Seattle · FI684", "Seattle-Tacoma International Airport"],
    ["Land at Keflavík", "Keflavik International Airport"],
    ["Drive to Seltjarnarnes", "Seltjarnarnes Iceland"],
    ["Þúfa", "Thufa Reykjavik"],
    ["Hallgrímskirkja", "Hallgrimskirkja Reykjavik"],
    ["Rainbow Street", "Rainbow Street Reykjavik"],
    ["Sun Voyager", "Sun Voyager Reykjavik"],
    ["Harpa & Reykjavík waterfront", "Harpa Concert Hall Reykjavik"],
    ["Sandholt and Brauð & Co", "Sandholt Reykjavik"],
    ["Check out & drive to Sunnumörk", "Sunnumork 810 Hveragerdi Iceland"],
    ["Sunnumörk", "Sunnumork 810 Hveragerdi Iceland"],
    ["Drive to Þingvellir", "Thingvellir National Park Iceland"],
    ["Þingvellir National Park", "Thingvellir National Park Iceland"],
    ["Drive to Strokkur", "Strokkur Iceland"],
    ["Geysir & Strokkur", "Strokkur Iceland"],
    ["Gullfoss", "Gullfoss Iceland"],
    ["Drive to Friðheimar", "Fridheimar Reykholt Iceland"],
    ["Friðheimar", "Fridheimar Reykholt Iceland"],
    ["Seljalandsfoss", "Seljalandsfoss Iceland"],
    ["Gljúfrabúi", "Gljufrabui Iceland"],
    ["Skógafoss", "Skogafoss Iceland"],
    ["Drive to Hrífunes", "Hrifunes Iceland"],
    ["ATV Plane Wreck", "Solheimasandur ATV Plane Wreck Iceland"],
    ["Dyrhólaey Viewpoint", "Dyrholaey Viewpoint Iceland"],
    ["Hálsanefshellir Cave", "Halsanefshellir Cave Iceland"],
    ["Reyniskirkja Church", "Reyniskirkja Church Iceland"],
    ["Reynisfjara Black Sand Beach", "Reynisfjara Black Sand Beach Iceland"],
    ["Vík í Mýrdal Church", "Vik i Myrdal Church Iceland"],
    ["Black Crust Pizzeria", "Black Crust Pizzeria Vik Iceland"],
    ["Skool Beans", "Skool Beans Vik Iceland"],
    ["Drive to Fjaðrárgljúfur", "Fjadrargljufur Iceland"],
    ["Fjaðrárgljúfur", "Fjadrargljufur Iceland"],
    ["Drive east to Skaftafell", "Skaftafell Iceland"],
    ["Drive to Hotel Smyrlabjörg", "Hotel Smyrlabjorg Iceland"],
    ["Drive to Skaftafell", "Skaftafell Iceland"],
    ["Glacier hike", "Arctic Adventures Skaftafell Base Camp 228J+FP5 Iceland"],
    ["Svartifoss", "Svartifoss Iceland"],
    ["Svínafellsjökull viewpoint", "Svinafellsjokull viewpoint Iceland"],
    ["Diamond Beach & glacier lagoon", "Jokulsarlon Glacier Lagoon Iceland"],
    ["Vestrahorn · Stokksnes", "Vestrahorn Stokksnes Iceland"],
    ["Drive to Djúpivogur", "Djupivogur Iceland"],
    ["Eastfjords scenic drive", "Seydisfjordur Iceland"],
    ["Seyðisfjörður", "Seydisfjordur Iceland"],
    ["Drive over Fjarðarheiði", "Hengifoss Iceland"],
    ["Hengifoss", "Hengifoss Iceland"],
    ["Egilsstaðir", "Egilsstadir Iceland"],
    ["Drive to Stuðlagil", "Studlagil Canyon Iceland"],
    ["Stuðlagil Canyon", "Studlagil Canyon Iceland"],
    ["Drive to Hotel Stuðlagil", "Hotel Studlagil Iceland"],
    ["Drive to Hverir", "Hverir Iceland"],
    ["Hverir geothermal area", "Hverir Iceland"],
    ["Lake Mývatn", "Lake Myvatn Iceland"],
    ["Drive to Húsavík", "Husavik Iceland"],
    ["Húsavík · GeoSea", "GeoSea Husavik Iceland"],
    ["Drive to Goðafoss", "Godafoss Iceland"],
    ["Goðafoss", "Godafoss Iceland"],
    ["Drive to Akureyri", "Akureyri Iceland"],
    ["Akureyri", "Akureyri Iceland"],
    ["Drive to Skjaldarvík", "Skjaldarvik Guest House Iceland"],
    ["Drive to Kirkjufell", "Kirkjufell Iceland"],
    ["Kirkjufell & Kirkjufellsfoss", "Kirkjufell Iceland"],
    ["Drive to Borgarfjörður", "Hraunfossar Iceland"],
    ["Hraunfossar & Barnafoss", "Hraunfossar Iceland"],
    ["Deildartunguhver", "Deildartunguhver Iceland"],
    ["Drive to Blue House", "Blue House B&B Seltjarnarnes Iceland"],
    ["Check in at Blue House", "Blue House B&B Seltjarnarnes Iceland"],
    ["Nauthólsvík Geothermal Beach", "Nautholsvik Geothermal Beach Iceland"],
    ["Bæjarins Beztu Pylsur", "Baejarins Beztu Pylsur Reykjavik"],
    ["Reykjavík free time", "Reykjavik Iceland"],
    ["Drive to Keflavík Airport", "Keflavik International Airport"],
    ["KEF check-in", "Keflavik International Airport"],
    ["Depart Reykjavík · FI683", "Keflavik International Airport"],
    ["Arrive in Seattle", "Seattle-Tacoma International Airport"]
  ]);

  document.querySelectorAll(".event-body h3").forEach((heading) => {
    const label = heading.cloneNode(true);
    label.querySelectorAll(".tag").forEach((tag) => tag.remove());
    const query = mapQueries.get(label.textContent.trim());
    if (!query) return;

    const link = document.createElement("a");
    link.className = "map-location-link";
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = `Open ${label.textContent.trim()} in Google Maps`;

    while (heading.firstChild) link.append(heading.firstChild);
    heading.append(link);
  });

  document.querySelectorAll(".stay h3").forEach((heading) => {
    const query = heading.textContent.split(" · ")[0].trim();
    const link = document.createElement("a");
    link.className = "map-location-link";
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} Iceland`)}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = `Open ${query} in Google Maps`;
    link.textContent = heading.textContent;
    heading.replaceChildren(link);
  });

  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });

  const tabs = document.querySelectorAll(".day-tab");
  const sections = document.querySelectorAll(".day-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      sections.forEach((section) => {
        section.hidden = filter !== "all" && section.dataset.day !== filter;
      });

      if (filter !== "all") {
        document.querySelector(`[data-day="${filter}"]`).scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
});
