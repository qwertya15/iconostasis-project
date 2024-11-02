/* TODO:

make fencing more strict: done?

*/
// version number
const _ver='1.0.0';
console.log(`v${v.textContent=_ver}`);

// zoom using mouse scroll wheel
document.addEventListener('wheel',(e)=>{
  if (e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
  }
}, {passive:false});

// elements manager
let E = {
  json:null,
  b:[],
  a:null,
  init:async ()=>{
    let json;
    try {
      // fetch elements info file
      let rsp = await fetch('./elements.json');
      if (rsp && rsp.ok) json = await rsp.json();
    } catch (e) {
      // use backup if file can't be found
      console.error('error fetching elements from JSON file, trying backup...');
      console.warn(e);
      try {
        let bkp = `data:application/json;base64,ewogICJlbGVtZW50cyI6ewogICAgCiAgICAiYWx0YXJfdmVpbCI6ewogICAgICAidGl0bGUiOiJBbHRhciBWZWlsIiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX3ZlaWwucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiVGhlIGFsdGFyIHZlaWxzLCBhbHNvIGtub3duIGFzIHRoZSBjb3ZlcmluZyBvZiB0aGUgUm95YWwgRG9vcnMsIGFyZSBwYXJ0IG9mIHRoZSBJY29ub3N0YXNpcyB0aGF0IGNvdmVycyB0aGUgYWx0YXIsIGJlaW5nIHRoZSBjdXJ0YWluIHRoYXQgZGl2aWRlcyB0aGUgU2FuY3R1YXJ5IGZyb20gdGhlIG91dHNpZGUuIFRoZSB0ZXJtIFJveWFsIERvb3JzIGlzIHVzZWQgdG8gZGVzY3JpYmUgdGhlIG1haW4gZW50cmFuY2UgYXMgaXQgcmVwcmVzZW50cyB0aGUgZW50cmFuY2UgdGhhdCBDaHJpc3QgZW50ZXJzIHRocm91Z2ggd2hlbiB0aGUgb2ZmZXJpbmdzIGFyZSBiZWluZyBjaG9zZW4uIFRoZXNlIEhvbHkgRG9vcnMgYWxzbyByZXByZXNlbnQgdGhlIGdhdGVzIG9mIEplcnVzYWxlbSwgdGhyb3VnaCB3aGljaCBDaHJpc3QgZW50ZXJzIG9uIFBhbG0gU3VuZGF5LCBhbmQgaW4gYWxsLCB0aGV5IHJlcHJlc2VudCB0aGUgZW50cmFuY2UgdG8gSGVhdmVuLiBcblxuVGhlIGN1cnRhaW4gY29uY2VwdCBvZiB0aGlzIGVudHJhbmNlIGlzIHRvIGJlIGEgcmVtaW5kZXIgb2YgdGhlIFRlbXBsZSBpbiBKZXJ1c2FsZW0sIGFzIHZlaWxpbmcgdGhlIGVudHJhbmNlLCBjb3ZlcnMgdGhlIGluc2lkZSBvZiB0aGUgU2FuY3R1YXJ5LiBUaGlzIGFsdGFyIHZlaWwgaXMgYSBzZXQgb2YgY292ZXJpbmdzIGFuZCBjdXJ0YWlucyB0aGF0IHByb3ZpZGUgdGhlIHJpZ2h0IHByb3RlY3Rpb24gYW5kIHZlbmVyYXRpb24gZHVyaW5nIHRoZSBsaXR1cmd5LCBhbmQgdGhlcmUgaXMgbm8gdGltZSB0aHJvdWdoIHdoaWNoIGl0IHNob3VsZCBiZSBvcGVuIG9yIHVuY292ZXJlZCB1bmxlc3MgZHVyaW5nIGEgc2VydmljZS4gXG5cblRoZSBzaWduaWZpY2FuY2Ugb2YgdGhlIGN1cnRhaW4gaXMgcHJlc2VudGVkIGJ5IHRoZSBBcG9zdGxlcyBpbiBIZWJyZXdzIDkuIEluIHRoZSB0ZW1wbGUsIHRoZXJlIGlzIGEgcm9vbSBiZWhpbmQgY3VydGFpbnMgdGhhdCBjb250YWlucyB0aGUgaG9seSBteXN0ZXJpZXMsIHdoaWNoIGlzIHRoZSBleGFtcGxlIHNldCBmb3IgdGhlIGNodXJjaCBpbiBvdXIgbW9kZXJuIGRheS4gIiwKICAgICAgIngiOiIxOTUwIiwKICAgICAgInkiOiIxNjcwIgogICAgfSwKICAgIAogICAgImFsdGFyX2ljb25famVzdXMiOnsKICAgICAgInRpdGxlIjoiSWNvbiBvZiBvdXIgTG9yZCBKZXN1cyBDaHJpc3QiLAogICAgICAiaW1nX3VybCI6Ii4vbWVkaWEvcHJldmlld3MvYWx0YXJfaWNvbl9qZXN1cy5wbmciLAogICAgICAiZGVzY3JpcHRpb24iOiJUbyB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgUm95YWwgZG9vciBpcyB0aGUgaWNvbiBvZiBvdXIgTG9yZCBKZXN1cyBDaHJpc3QsIGlkZW50aWZpZWQgYnkgdGhlIENvcHRpYyBsZXR0ZXJzIOKAnDxzcGFuIGNsYXNzPVwiY29wdGljLXRleHRcIj7ispLiso7isqQg4rKg4rKs4rKkPC9zcGFuPuKAnSBvbiB0aGUgc2lkZXMgb2YgdGhlIExvcmTigJlzIHRocm9uZSwgd2hpY2ggaXMgdGhlIGFiYnJldmlhdGlvbiBmb3Ig4oCcSmVzdXMgQ2hyaXN04oCdLiAgVGhpcyBpY29uIGlzIGEgcmVtaW5kZXIgdGhhdCBKZXN1cyBpcyB0aGUgdW5pcXVlIGdhdGUgbGVhZGluZyB0byB0aGUgaGVhdmVubHkga2luZ2RvbS5cblxuQXQgdGhlIHRvcCBvZiB0aGUgaWNvbiB0aGUgd29yZCDigJw8c3BhbiBjbGFzcz1cImNvcHRpYy10ZXh0XCI+4rKg4rKI4rKa4rKk4rKw4rKm4rKO4rKiPC9zcGFuPuKAnSBpcyBhIHJlbWluZGVyIHRoYXQgSmVzdXMgaXMgb3VyIOKAnFNhdmlvcuKAnSBhbmQgSGUgaXMgdGhlIEdvb2QgU2hlcGhlcmQgd2hvIG9wZW5lZCB0aGUgZ2F0ZXMgdG8gaGVhdmVuIHRocm91Z2ggSGlzIGxpZmUtZ2l2aW5nIHNhY3JpZmljZS4iLAogICAgICAieCI6IjIzNjUiLAogICAgICAieSI6IjE2NDAiCiAgICB9LAoKICAgICJhbHRhcl9pY29uX2pvaG5fYmFwdGlzdCI6ewogICAgICAidGl0bGUiOiJJY29uIG9mIFN0LiBKb2huIHRoZSBCYXB0aXN0IiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25fam9obl9iYXB0aXN0LnBuZyIsCiAgICAgICJkZXNjcmlwdGlvbiI6IlRvIHRoZSByaWdodCBvZiB0aGUgSWNvbiBvZiBvdXIgTG9yZCBKZXN1cyBDaHJpc3QgaXMgdGhlIGljb24gb2YgU3QuIEpvaG4gdGhlIEJhcHRpc3QsIHdobyBwcmVwYXJlZCB0aGUgd2F5IGZvciB0aGUgTG9yZOKAmXMgY29taW5nLCBhbmQgYWJvdXQgd2hvbSBDaHJpc3Qgc2FpZCB0aGVyZSB3YXMsIOKAnG5vIGdyZWF0ZXIgbWFuIGJvcm7igJ0gKE1hdHQgMTE6MTEpLiIsCiAgICAgICJ4IjoiMjUxNSIsCiAgICAgICJ5IjoiMTY0MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fcGF0cm9uX3NhaW50Ijp7CiAgICAgICJ0aXRsZSI6Ikljb24gb2YgdGhlIFBhdHJvbiBTYWludCBvZiB0aGUgSW5kaXZpZHVhbCBDaHVyY2giLAogICAgICAiaW1nX3VybCI6Ii4vbWVkaWEvcHJldmlld3MvYWx0YXJfaWNvbl9wYXRyb25fc2FpbnQucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiTmV4dCB0byB0aGUgSWNvbiBvZiBTdC4gSm9obiB0aGUgQmFwdGlzdCBjb21lcyB0aGUgSWNvbiBvZiBTdC4gQXRoYW5hc2l1cyB0aGUgQXBvc3RvbGljLCB0aGUgcGF0cm9uIHNhaW50IG9mIG91ciBwYXJpc2guXG5cblRyYWRpdGlvbmFsbHkgaW4gYWxsIENvcHRpYyBDaHVyY2hlcywgdGhpcyBsb2NhdGlvbiBvbiB0aGUgaWNvbm9zdGFzaXMsIGlzIHJlc2VydmVkIHRvIHBvcnRyYXlzIHRoZSBTYWludCBpbiB3aG9zZSBob25vciB0aGUgQ2h1cmNoIHdhcyBidWlsdC5cblxuVGhpcyBpY29uIGNhbiBiZSBmb2xsb3dlZCBieSBhbnkgbnVtYmVyIG9mIGljb25zIG9mIHNhaW50cywgbWFydHlycywgb3IgZXZlbnRzIGZyb20gYm90aCB0aGUgTmV3IGFuZCBPbGQgVGVzdGFtZW50cy4iLAogICAgICAieCI6IjI2NjAiLAogICAgICAieSI6IjE2NDAiCiAgICB9LAoKICAgICJhbHRhcl9pY29uX3RoZW90b2tvcyI6ewogICAgICAidGl0bGUiOiJJY29uIG9mIFRoZW90b2tvcyBTdC4gTWFyeSIsCiAgICAgICJpbWdfdXJsIjoiLi9tZWRpYS9wcmV2aWV3cy9hbHRhcl9pY29uX3RoZW90b2tvcy5wbmciLAogICAgICAiZGVzY3JpcHRpb24iOiJUbyB0aGUgbGVmdCBvZiB0aGUgUm95YWwgRG9vcnMsIGlzIHRoZSBpY29uIG9mIHRoZSBWaXJnaW4gTWFyeSwgd2hvIHJlcHJlc2VudHMgdGhlIHdob2xlIGNodXJjaCBhbmQgdGhlIFF1ZWVuIHdobyBzaXRzIG9uIHRoZSByaWdodCBoYW5kIG9mIG91ciBMb3JkIEplc3VzIENocmlzdC5cblxuVGhlIGljb24gaXMgaW5zY3JpYmVkIHdpdGggdGhlIHdvcmRzIOKAnDxzcGFuIGNsYXNzPVwiY29wdGljLXRleHRcIj7isqbisqDisobisqLispDisojisprisp7isqQ8L3NwYW4+LTxzcGFuIGNsYXNzPVwiY29wdGljLXRleHRcIj7ispjisqIg4rKQz6o8L3NwYW4+IC0gPHNwYW4gY2xhc3M9XCJjb3B0aWMtdGV4dFwiPuKykuKyjuKypCDisqDisqzisqQ8L3NwYW4+4oCdIHdoaWNoIGlzIHRoZSBDb3B0aWMgZm9yIOKAnFRoZSBWaXJnaW4gTWFyaWEgbW90aGVyIG9mIEplc3VzIENocmlzdOKAnS4iLAogICAgICAieCI6IjE1NDAiLAogICAgICAieSI6IjE2NDAiCiAgICB9LAoKICAgICJhbHRhcl9pY29uX2xhc3Rfc3VwcGVyIjp7CiAgICAgICJ0aXRsZSI6IlRoZSBMYXN0IFN1cHBlciIsCiAgICAgICJpbWdfdXJsIjoiLi9tZWRpYS9wcmV2aWV3cy9hbHRhcl9pY29uX2xhc3Rfc3VwcGVyLnBuZyIsCiAgICAgICJkZXNjcmlwdGlvbiI6IkRpcmVjdGx5IGFib3ZlIHRoZSBSb3lhbCBEb29ycyBlbnRyYW5jZSwgdGhlIGljb24gb2YgdGhlIEV1Y2hhcmlzdCBpcyBtb3VudGVkLCBzaW5jZSB0aHJvdWdoIHRoZXNlIGRvb3JzIHRoZSBLaW5nIG9mIEtpbmdzIGlzIGJyb3VnaHQgb3V0IGluIHRoZSBmb3JtIG9mIEhvbHkgQ29tbXVuaW9uIHRvIHRoZSBmYWl0aGZ1bC5cblxuVGhlIExhc3QgU3VwcGVyIGljb24gc2hvd3MgQ2hyaXN0IGdpdmluZyBjb21tdW5pb24gdG8gSGlzIGRpc2NpcGxlcywgd2hpY2ggaWxsdXN0cmF0ZXMgYW5kIHNpZ25pZmllcyB0aGUgU2FjcmlmaWNlIGluc3RpdHV0ZWQgYnkgb3VyIExvcmQgQ2hyaXN0LiIsCiAgICAgICJ4IjoiMTk1MCIsCiAgICAgICJ5IjoiMTQ1MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fYXBvc3RsZXMiOnsKICAgICAgInRpdGxlIjoiVGhlIDEyIEFwb3N0bGVzIiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25fYXBvc3RsZXMucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiQWxvbmcgdGhlIHRvcCByb3cgb2YgdGhlIGljb25vc3Rhc2lzIGFyZSB0aGUgaWNvbnMgb2YgdGhlIHR3ZWx2ZSBkaXNjaXBsZXMuIFRoZXkgY29uZmlybSB0aGUgYXBvc3RvbGljIG5hdHVyZSBvZiBvdXIgY2h1cmNoLiBPcnRob2RveHkgaXMgZXN0YWJsaXNoZWQgb24gdGhlIGFwb3N0b2xpYyBmYWl0aCwgY29udGludWVzIHRvIGV4aXN0IGluIGFuIGFwb3N0b2xpYyB3YXksIGFuZCBpcyBzaGVwaGVyZGVkIGJ5IGFwb3N0b2xpYyBwYXN0b3JzLiIsCiAgICAgICJ4IjoiMTQwMCIsCiAgICAgICJ5IjoiMTQ1MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fbmljaGUiOnsKICAgICAgInRpdGxlIjoiTmljaGUvYXBzZSIsCiAgICAgICJpbWdfdXJsIjoiLi9tZWRpYS9wcmV2aWV3cy9hbHRhcl9uaWNoZTIucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiVGhlIE5pY2hlLCBvciB0aGUgYXBzZSwgdHJhZGl0aW9uYWxseSBrbm93biBhcyBUaGUgRmF0aGVy4oCZcyBCb3NvbSwgaXMgdGhlIHNlbWljaXJjdWxhciBlYXN0ZXJuIHdhbGwgb2YgdGhlIFNhbmN0dWFyeSBmYWNpbmcgdGhlIEFsdGFyLiBJdCBjb250YWlucyB0aGUgaWNvbiBvZiB0aGUgTG9yZCBKZXN1cyBDaHJpc3QgYXBwZWFyaW5nIHRvIHNpdCwgcmVzdGluZyBIaXMgZmVldCBvbiB0aGUgcGxhbmV0IGVhcnRoIGZvciBIZSBpcyB0aGUgQWxtaWdodHkgT25lLCBhbmQgaG9sZGluZyB0aGUgQmlibGUgY29uZmlybWluZyBvdXIgb3J0aG9kb3ggdGVhY2hpbmcgdGhhdCB0aGUgTG9yZCBpcyB0aGUgV2F5LCDigJxJIGFtIHRoZSB3YXksIHRoZSB0cnV0aCwgYW5kIHRoZSBsaWZlLiBObyBvbmUgY29tZXMgdG8gdGhlIEZhdGhlciBleGNlcHQgdGhyb3VnaCBNZS7igJ0gKEpvaG4gMTQ6NilcblxuVGhlIHBpY3R1cmUgb2YgdGhlIExvcmQgYXBwZWFycyBzdXJyb3VuZGVkIGZyb20gdGhlIHRvcCB3aXRoIHRoZSB0d28gQ29wdGljIGxldHRlcnMgPHNwYW4gY2xhc3M9XCJjb3B0aWMtdGV4dFwiPuKygDwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJjb3B0aWMtdGV4dFwiPuKysDwvc3Bhbj4gZGVjbGFyaW5nIG91ciBmYWl0aCB0aGF0IHRoZSBMb3JkIGlzIHRoZSBCZWdpbm5pbmcgYW5kIHRoZSBFbmQsIOKAnEkgYW0gdGhlIEFscGhhIGFuZCB0aGUgT21lZ2EsIHRoZSBCZWdpbm5pbmcgYW5kIHRoZSBFbmQs4oCdIHNheXMgdGhlIExvcmQsIOKAnHdobyBpcyBhbmQgd2hvIHdhcyBhbmQgd2hvIGlzIHRvIGNvbWUsIHRoZSBBbG1pZ2h0eeKAneKAnSAoUmV2ZWxhdGlvbiAxOjgpLCBhbmQgb24gYm90aCBzaWRlcyBvZiB0aGUgcGljdHVyZSB0aGUgZm91ciBMaXZpbmcgY3JlYXR1cmVzLCB0aGUgc3VuIGFuZCB0aGUgbW9vbiwgYW5kIHRoZSB0d2VudHktZm91ciBoZWF2ZW5seSBQcmVzYnl0ZXJzIG9mZmVyaW5nIGluY2Vuc2UuIOKAnE5vdyB3aGVuIEhlIGhhZCB0YWtlbiB0aGUgc2Nyb2xsLCB0aGUgZm91ciBsaXZpbmcgY3JlYXR1cmVzIGFuZCB0aGUgdHdlbnR5LWZvdXIgZWxkZXJzIGZlbGwgZG93biBiZWZvcmUgdGhlIExhbWIsIGVhY2ggaGF2aW5nIGEgaGFycCwgYW5kIGdvbGRlbiBib3dscyBmdWxsIG9mIGluY2Vuc2UsIHdoaWNoIGFyZSB0aGUgcHJheWVycyBvZiB0aGUgc2FpbnRzLuKAnSAoUmV2ZWxhdGlvbiA1OjgpIiwKICAgICAgIngiOiIxOTUwIiwKICAgICAgInkiOiIxMTUwIgogICAgfSwKCiAgICAiYWx0YXJfaWNvbl9hbm51bmNpYXRpb24iOnsKICAgICAgInRpdGxlIjoiQW5udW5jaWF0aW9uIiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25fYW5udW5jaWF0aW9uLnBuZyIsCiAgICAgICJkZXNjcmlwdGlvbiI6IlRvIHRoZSBsZWZ0IG9mIHRoZSBpY29uIG9mIFN0LiBNYXJ5IGNhbiBiZSBzZWVuIHRoZSBJY29uIG9mIHRoZSBBbm51bmNpYXRpb24uIFRoZSBBbm51bmNpYXRpb24gaXMgdGhlIGV2ZW50IGluIHdoaWNoIHRoZSBBcmNoYW5nZWwgR2FicmllbCBjYW1lIHRvIFN0LiBNYXJ5LCBhbm5vdW5jaW5nIHRoZSBnb29kIG5ld3Mgb2YgdGhlIGJpcnRoIGFuZCBjb25jZXB0aW9uIG9mIENocmlzdCwgdGhlIHByb21pc2VkIE1lc3NpYWgsIGluIHRoZSB2aXJnaW5hbCB3b21iIG9mIE91ciBNb3RoZXIuIFRoZSBBbm51bmNpYXRpb24gaXMgb25lIG9mIHRoZSBzZXZlbiBtYWpvciBmZWFzdHMgaW4gdGhlIENvcHRpYyBjaHVyY2guIFRoZSBBbm51bmNpYXRpb24gaXMgY2VsZWJyYXRlZCBvbiB0aGUgMjl0aCBvZiBQYXJlbWhvdGVwLiBUaGlzIGFubnVuY2lhdGlvbiBjYW4gYmUgcmVhZCBpbiBMdWtlIDE6MjYtMzgsIHNob3dpbmcgdGhlIGh1bWlsaXR5IGFuZCB3aWxsaW5nbmVzcyBvZiBTdC4gTWFyeSB0byBzdWJtaXQgaGVyc2VsZiB0byBPdXIgTG9yZCBhbmQgdG8gR29k4oCZcyB3aWxsLiBcblxuVGhlIEljb24gc2hvd3MgdGhlIEFyY2hhbmdlbCBHYWJyaWVsIGNvbWluZyB0byBTdC4gTWFyeSwgY2FycnlpbmcgYW4gb2xpdmUgYnJhbmNoLCBzaWduaWZ5aW5nIHRoZSBnb29kIG5ld3MsIGFuZCB0aGUgcGVhY2UgdG8gY29tZSBpbnRvIHRoZSB3b3JsZC4gVGhlIGljb24gYWxzbyBzZXJ2ZXMgYXMgYSByZW1pbmRlciBvZiB0aGUgZnVsZmlsbG1lbnQgb2YgdGhlIHByb3BoZWNpZXMgY29uY2VybmluZyBvdXIgTG9yZCwgYW5kIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG1pbmlzdHJ5IGxlZCBieSBIaW0uIiwKICAgICAgIngiOiIxNDAwIiwKICAgICAgInkiOiIxNjQwIgogICAgfQogICAgCiAgfQp9`;
        if (!bkp) throw new Error('no bkp JSON available');
        json = await (await fetch(bkp)).json();
        alert('initial elements info file not found, using backup info...');
      } catch (e) {
        console.error(e);
        return alert('error fetching the elements\' information!');
      }
    }
    setTimeout(()=>E.loadElems(json),500);
  },
  // offset:{x:-1170,y:-1750,scale:2.12}, // (possibly) temporary, to help with moving elems for different images
  offset:{x:-200,y:-1020,scale:1.62},
  // offset:{x:0,y:0,scale:1},
  loadElems:(json)=>{
    if (json==null) return alert('json is null!');
    //console.log('got json:',json);
    E.json=json;
    I.e.querySelectorAll('.element').forEach(b=>b.remove());
    for (let [id,e] of Object.entries(E.json.elements)) {
      let b=`<button class="element" id="${id}"></button>`;
      I.e.insertAdjacentHTML('beforeend',b);
      b=I.e.lastElementChild;
      b.style.setProperty('--x',(e.x*E.offset.scale)+E.offset.x+'px');
      b.style.setProperty('--y',(e.y*E.offset.scale)+E.offset.y+'px');
      E.b.push(b);
      b.onclick=()=>E.elem(b,String(id));
    }
    requestAnimationFrame(()=>I.updatePZ());
  },
  activate:(b1=null)=>{
    if (E.a) E.a.classList.remove('active');
    if (b1) {
      E.a=b1;
      E.a.classList.add('active');
    }
  },
  elem:(b,id)=>{
    E.activate(b);
    b.classList.add('active');
    let e=E.json.elements[id];
    T.show(b,e);
  },
  update:(s)=>{ for (let b of E.b)  b.style.scale=`min(5,max(0.4,${s}))`; },
}

// tooltip manager
let T = {
  // x0:0, y0:0,
  t:document.querySelector('#tooltip'),
  th:null,
  ti:null,
  td:null,
  tc:null,
  toggle:(show=!T.open())=>{
    if (show) T.t.classList.remove('hidden');
    else {
      T.t.classList.add('hidden');
      for (let ae of document.querySelectorAll('.element.active'))
        ae.classList.remove('active');
    }
  },
  open:()=>!T.t.classList.contains('hidden'),
  init:()=>{
    T.th=T.t.querySelector('.tt-header');
    T.ti=T.t.querySelector('.tt-img');
    T.td=T.t.querySelector('.tt-desc');
    T.tc=T.t.querySelector('.close');
    T.tc.onclick=()=>T.toggle(false);
    requestAnimationFrame(()=>T.t.classList.add('loaded'));
    // close open tooltip with [Esc]
    window.addEventListener('keydown',(e)=>{
      if (e.key=='Escape' && T.open())
        T.toggle(false);
    });
    T.about.showAbout();
  },
  render:(b)=>{
    let r=b?.getBoundingClientRect();
    if (r) {
      // limit to screen border
      let x=Math.max(0,r.x-(T.t.offsetWidth/2)),
          y=Math.max(0,r.y-(T.t.offsetHeight/2));
      x=Math.min(window.innerWidth-(T.t.offsetWidth),x),
      y=Math.min(window.innerHeight-(T.t.offsetHeight),y);
      T.t.style.setProperty('--x',x+'px');
      T.t.style.setProperty('--y',y+'px');
    } else {
      console.error('couldn\'t get bounding rect for btn!');
    }
  },
  show:(b,e)=>{
    T.toggle(false);
    setTimeout(()=>{
      T.th.textContent=e.title;
      if (e.img_url) {
        T.ti.innerHTML=`<img src="./${e.img_url}"></img>`;
        let i=T.ti.querySelector('img');
        i.onload=i.onerror=()=>{
          i.onload=i.onerror=null;
          setTimeout(()=>{
            T.ti.classList.remove('hidden');
            T.render(b);
            T.toggle(true);
          },0);
        }
      } else {
        T.ti.classList.add('hidden');
        setTimeout(()=>{
          T.render(b);
          T.toggle(true);
        },0);
      }
      T.td.innerHTML=e.description;
      // regex find: ([ⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲔⲕⲖⲗⲘⲙⲚⲛⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲰⲱϢϣϤϥϦϧϨϩϪϫϬϭϮϯ]+[ⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲔⲕⲖⲗⲘⲙⲚⲛⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲰⲱϢϣϤϥϦϧϨϩϪϫϬϭϮϯ ]+[ⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲔⲕⲖⲗⲘⲙⲚⲛⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲰⲱϢϣϤϥϦϧϨϩϪϫϬϭϮϯ]+)
      // regex replace: <span class=\"coptic-text\">$1</span>
    },250);
  },
  about:{
    title:`Welcome to \n“Our Iconostasis Exploration”`,
    desc:`\tWelcome to our interactive journey into the heart of Orthodox Christian worship! We invite you to explore our digital iconostasis by navigating around the screen and clicking on any icons or elements that catch your eye. Each click will reveal detailed insights and information about the significance and purpose of the icon you selected.\n\n\tWhether you are a member of the Orthodox Church or simply curious about its traditions, we hope this website enriches your understanding and appreciation of this sacred art. Enjoy your exploration!`,
    showAbout:()=>{
      T.th.textContent=T.about.title;
      T.ti.classList.add('hidden');
      requestAnimationFrame(()=>{
        T.t.style.setProperty('--x',((window.innerWidth/2)-(T.t.offsetWidth/2))+'px');
        T.t.style.setProperty('--y',((window.innerHeight/2)-(T.t.offsetHeight/2))+'px');
        T.toggle(true);
      });
      // set the "about" message (and "working on" description)
      T.td.innerHTML=`<!--b><i>currently working on: improved fencing + new image</i></b><br/><br/-->${T.about.desc}`;
    },
  },
}

// PanZoom and image manager
let I = {
  fencing:true,
  fenceMargin:450,
  c:document.querySelector('#container'),
  e:document.querySelector('#img'),
  ie:null,
  pz:null,
  transform:(scale,x,y)=>{
    I.pz.setStyle('transform', `scale(${scale}) translate(${x}px, ${y}px)`);
    I.updateBtns(scale);
  },
  init:()=>{
    I.ie=I.e.querySelector('img');
    I.pz=Panzoom(I.e, {
      canvas: true,
      contain: 'outside',
      /*
      setTransform: (_, { scale, x, y }) => {
        // bad non-working old code
        // let s1=I.pz.getScale()-I.pz.getOptions().maxScale;
        // let s1=1//scale;
        // let w=I.e.offsetWidth,h=I.e.offsetHeight;
        // let dx=(w * s1 * 0.5), dy=(h * s1 * 0.5);
        // let x1=Math.max(Math.min(-dx,x),-w-dx);
        // if (x1 != x) return I.pz.pan(x1,y);
        //if (x + (scale *)) 

        // don't fence if I.fencing is false
        if (!I.fencing) {
          return I.transform(scale,x,y);
        }

        // great working old code
        // calculate constraints
        let xmin = (I.ie.width/2)-(I.fenceMargin*I.getScale());
        let ymin = (I.ie.height/2)-(I.fenceMargin*I.getScale());
        // apply constraints
        let x1 = Math.max(-xmin,Math.min(xmin,x));
        let y1 = Math.max(-ymin,Math.min(ymin,y));
        I.transform(scale,x1,y1);
      },
      */
      setTransform: (_, { scale, x, y }) => {
        // update the element buttons when panning/zooming
        I.updateBtns();
        I.transform(scale,x,y);
      },
      startScale: 0.5,
      minScale: 0.125,
      maxScale: 4,
    });
    I.c.addEventListener('wheel',(e)=>I.pz.zoomWithWheel(e),{passive:false});
    I.reset();

    // update when window is resized
    window.onresize=()=>I.updatePZ();
  },
  zoomCenter(isIn) {
    I.pz.zoomWithWheel({
      clientX:window.innerWidth/2,
      clientY:window.innerHeight/2,
      deltaY:isIn ? -4 : 4,
      preventDefault(){},
    })
  },
  zoomIn:()=>{
    I.zoomCenter(true);
    // I.updateBtns();
  },
  zoomOut:()=>{
    I.zoomCenter(false);
    // I.updateBtns();
  },
  reset:()=>{
    I.pz.zoom(0,{animate:false});
    // I.pz.pan(0,0);
    // I.updateBtns();
  },
  updateBtns:(s=I.getScale())=>{
    E.update(1/s);
  },
  getScale:()=>I.pz.getScale(),
  getStep:()=>I.pz.getOptions().step,
  updatePZ:()=>I.pz.zoom(I.getScale()),
}

// modal manager
let M = {
  e:document.querySelector('modal'),
  focus:()=>M.e.focus(),
  focused:()=>!!document.activeElement.closest('modal'),
  open:()=>!!M.e.getAttribute('open'),
  toggle:(open=!M.open())=>{
    if (open) {
      T.toggle(false); // close tooltip when modal opens
      M.e.setAttribute('open',true);
      setTimeout(_=>M.focus(),100);
    } else M.e.removeAttribute('open');
  },
  init:()=>{
    // [Esc] to close & keyboard focus trapping (when open)
    document.addEventListener('keydown',(e)=>{
      requestAnimationFrame(_=>{
        if (M.open()) {
          if (!M.focused()) M.focus();
          else if (e.code=='Escape') M.toggle(false);
        }
      });
    },{passive:true});
    M.e.classList.add('loaded');
    M.toggle(false);
  }
}

M.init();
T.init();
E.init();
I.init();

// old dev img switcher
// let imgs=[
//   '/media/jk-iconostasis2.jpg',
//   '/media/jk-iconostasis2-blurred.jpg',
//   '/media/jk-iconostasis2-highlighted.jpg',
//   '/media/jk-iconostasis2-cropped.png',
//   '/media/jk-iconostasis2-cropped2.png'
// ], descs=[
//   'original (1/5)',
//   'blurred (2/5)',
//   '"highlighted" (3/5)',
//   'cropped (unedited) (4/5)',
//   'cropped (padded to fit current elems) (5/5)',
// ], imgId=0;
// function devImgSwitch(btn) {
//   imgId=(imgId+1)%imgs.length;
//   I.ie.src=imgs[imgId];
//   btn.textContent='img: '+descs[imgId];
// }